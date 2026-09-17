"use client";

import { useActionState, useState } from "react";
import { Check, Gamepad2, ListPlus, LoaderCircle, Plus, Shield } from "lucide-react";
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
      <Button onClick={() => setOpen(true)} variant={guess ? "secondary" : "default"} size={featured ? "lg" : "default"} className={cn("rounded-sm", featured && "w-full bg-[#df735a] text-[#181717] hover:bg-[#ead8b8] sm:w-auto")}>
        {featured ? <Shield className="size-4" /> : guess ? <Gamepad2 className="size-4" /> : <Plus className="size-4" />}
        {triggerLabel ?? (guess ? "Nouvelle partie" : "Nouvelle tier list")}
      </Button>
      <Dialog open={open} onClose={() => { if (!pending) setOpen(false); }}
        title={guess ? "Nouvelle partie" : "Nouveau classement"}
        description="Partagez ensuite le code d’invitation.">
        <form action={formAction} className="space-y-5">
          {!guess && (
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-[#ead8b8]">À classer</legend>
              <div className="grid grid-cols-2 gap-3">
                {([{ value: "games", title: "Jeux", icon: Gamepad2 }, { value: "characters", title: "Armures & DA", icon: Shield }] as const).map(({ value, title, icon: Icon }) => (
                  <label key={value} className={cn("court-frame relative cursor-pointer border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#df735a]", category === value ? "border-[#df735a] bg-[#df735a]/10" : "border-[#ead8b8]/20 bg-[#181717] hover:border-[#ead8b8]/50")}>
                    <input type="radio" name="category" value={value} checked={category === value} onChange={() => setCategory(value)} className="sr-only" />
                    <Icon className={cn("mb-3 size-5", category === value ? "text-[#df735a]" : "text-[#ead8b8]/50")} strokeWidth={1.5} />
                    {category === value && <Check className="absolute right-3 top-3 size-3.5 text-[#df735a]" />}
                    <span className="block text-sm font-semibold text-[#ead8b8]">{title}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {!guess && category === "characters" && (
            <label className="block text-xs font-semibold text-[#ead8b8]">Jeu
              <select name="catalog_filter" defaultValue="all" className="focus-ring mt-2 h-11 w-full rounded-sm border border-[#ead8b8]/20 bg-[#181717] px-3 text-sm font-normal">
                <option value="all">Crown Gambit + Sovereign Tower</option>
                <option value="crown-gambit">Crown Gambit</option>
                <option value="sovereign-tower">Sovereign Tower</option>
              </select>
            </label>
          )}
          <label className="block text-xs font-semibold text-[#ead8b8]">Nom
            <Input name="title" className="mt-2 rounded-sm font-normal" key={guess ? "guess" : category} defaultValue={guess ? "Qui est-ce ?" : category === "characters" ? "Armures & DA" : "Nos jeux"} required minLength={2} maxLength={80} />
          </label>
          {state.error && <p role="alert" className="border-l-2 border-[#df735a] bg-[#df735a]/10 p-3 text-sm text-[#df735a]">{state.error}</p>}
          <Button type="submit" className="w-full rounded-sm" size="lg" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <ListPlus className="size-4" />}
            {pending ? "Création…" : guess ? "Créer la partie" : "Créer le classement"}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
