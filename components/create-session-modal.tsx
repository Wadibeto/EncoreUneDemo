"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight, Check, Gamepad2, ListPlus, LoaderCircle, Plus, Shield } from "lucide-react";
import { createGuessSessionAction, createTierListAction } from "@/app/actions/sessions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CreateSessionModal({ kind, defaultCategory = "games", triggerLabel, featured = false }: {
  kind: "tier" | "guess";
  defaultCategory?: "games" | "characters";
  triggerLabel?: string;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<"games" | "characters">(defaultCategory);
  const action = kind === "tier" ? createTierListAction : createGuessSessionAction;
  const [state, formAction, pending] = useActionState(action, {});
  const guess = kind === "guess";

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={guess ? "secondary" : "default"} size={featured ? "lg" : "default"} className={featured ? "w-full sm:w-auto" : undefined}>
        {featured ? <Shield className="size-4" /> : guess ? <Gamepad2 className="size-4" /> : <Plus className="size-4" />}
        {triggerLabel ?? (guess ? "Nouvelle partie" : "Nouvelle tier list")}
        {featured && <ArrowUpRight className="ml-2 size-4" />}
      </Button>
      <Dialog open={open} onClose={() => { if (!pending) setOpen(false); }}
        title={guess ? "Que le duel commence." : "Un nouveau classement."}
        description={guess ? "Une partie de Qui est-ce ? autour de vos jeux. Invitez votre ami avec un code privé." : "Choisissez votre collection, puis inventez vos propres règles."}>
        <form action={formAction} className="space-y-6">
          {!guess && (
            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-slate-300">Que voulez-vous classer ?</legend>
              <div className="grid grid-cols-2 gap-3">
                {([{ value: "games", title: "Nos jeux", text: "L’aventure vécue ensemble", icon: Gamepad2 }, { value: "characters", title: "Armures & DA", text: "Les personnages et leurs designs", icon: Shield }] as const).map(({ value, title, text, icon: Icon }) => (
                  <label key={value} className={cn("relative cursor-pointer rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary", category === value ? "border-primary bg-primary/10" : "border-border bg-black/10 hover:border-slate-500")}>
                    <input type="radio" name="category" value={value} checked={category === value} onChange={() => setCategory(value)} className="sr-only" />
                    <Icon className={cn("mb-4 size-5", category === value ? "text-primary" : "text-slate-400")} strokeWidth={1.5} />
                    {category === value && <Check className="absolute right-3 top-3 size-3.5 text-primary" />}
                    <span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-[11px] leading-5 text-slate-400">{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {!guess && category === "characters" && (
            <label className="block text-xs font-semibold text-slate-300">Les univers à explorer
              <select name="catalog_filter" defaultValue="all" className="focus-ring mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal">
                <option value="all">Crown Gambit + Sovereign Tower</option>
                <option value="crown-gambit">Crown Gambit</option>
                <option value="sovereign-tower">Sovereign Tower</option>
              </select>
              <span className="mt-2 block text-[11px] font-normal leading-5 text-slate-400">Illustrations et portraits à consulter pendant le classement. Les sources sont indiquées dans chaque fiche.</span>
            </label>
          )}
          <label className="block text-xs font-semibold text-slate-300">{guess ? "Le nom de votre partie" : "Le nom de votre classement"}
            <Input name="title" className="mt-2 font-normal" key={guess ? "guess" : category} defaultValue={guess ? "Duel du soir" : category === "characters" ? "Notre panthéon des armures" : "Nos jeux, notre verdict"} required minLength={2} maxLength={80} />
          </label>
          <div className="rounded-xl border border-border bg-black/10 p-3 text-xs leading-5 text-slate-400">Un espace partagé en temps réel. Créez-le, puis envoyez le code d’invitation à votre duo.</div>
          {state.error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{state.error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <ListPlus className="size-4" />}
            {pending ? "Création en cours…" : "Créer et entrer dans l’atelier"}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
