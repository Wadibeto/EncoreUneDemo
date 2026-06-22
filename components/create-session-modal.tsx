"use client";

import { useActionState, useState } from "react";
import { Gamepad2, ListPlus, LoaderCircle, Plus } from "lucide-react";
import { createGuessSessionAction, createTierListAction } from "@/app/actions/sessions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CreateSessionModal({ kind }: { kind: "tier" | "guess" }) {
  const [open, setOpen] = useState(false);
  const action = kind === "tier" ? createTierListAction : createGuessSessionAction;
  const [state, formAction, pending] = useActionState(action, {});
  const guess = kind === "guess";

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={guess ? "secondary" : "default"}>
        {guess ? <Gamepad2 className="size-4" /> : <Plus className="size-4" />}
        {guess ? "Nouvelle partie" : "Nouvelle tier list"}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={guess ? "Créer une partie Qui est-ce ?" : "Créer une tier list"}
        description={guess ? "Votre ami pourra rejoindre avec un lien privé." : "Les jeux du catalogue seront ajoutés automatiquement."}
      >
        <form action={formAction} className="space-y-4">
          <label className="block text-sm font-medium">Titre
            <Input name="title" className="mt-2" defaultValue={guess ? "Duel du soir" : "Notre classement ultime"} required minLength={2} maxLength={80} autoFocus />
          </label>
          {state.error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <ListPlus className="size-4" />}
            Créer et ouvrir
          </Button>
        </form>
      </Dialog>
    </>
  );
}
