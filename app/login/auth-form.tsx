"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { loginAction, registerAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function AuthForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(searchParams.get("mode") === "register" ? "register" : "login");
  const action = mode === "login" ? loginAction : registerAction;
  const next = searchParams.get("next") ?? "";
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-black/25 p-1">
        {(["login", "register"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === item ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {item === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>
      <form key={mode} action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        {mode === "register" && (
          <label className="block text-sm font-medium">Pseudo<Input name="username" autoComplete="username" placeholder="Votre pseudo" className="mt-2" required /></label>
        )}
        <label className="block text-sm font-medium">E-mail<Input name="email" type="email" autoComplete="email" placeholder="vous@exemple.fr" className="mt-2" required /></label>
        <label className="block text-sm font-medium">Mot de passe<Input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="8 caractères minimum" className="mt-2" minLength={8} required /></label>
        {state.error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{state.error}</p>}
        {state.success && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{state.success}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
