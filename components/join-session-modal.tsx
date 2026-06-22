"use client";

import { useActionState, useState } from "react";
import { DoorOpen, LoaderCircle } from "lucide-react";
import { joinSessionAction } from "@/app/actions/sessions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function JoinSessionModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(joinSessionAction, {});
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}><DoorOpen className="size-4" />Rejoindre avec un code</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Rejoindre votre ami" description="Collez un code T-… ou G-…">
        <form action={formAction} className="space-y-4">
          <Input name="code" placeholder="T-ABCDEFG2" className="font-mono uppercase tracking-widest" pattern="[TGtg]-[A-Za-z2-9]{8}" required autoFocus />
          {state.error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>{pending && <LoaderCircle className="size-4 animate-spin" />}Rejoindre</Button>
        </form>
      </Dialog>
    </>
  );
}
