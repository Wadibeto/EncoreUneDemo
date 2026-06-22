import Link from "next/link";
import { redirect } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { joinSessionAction } from "@/app/actions/sessions";
import { AppShell } from "@/components/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/join/${code}`)}`);
  return (
    <AppShell>
      <div className="mx-auto max-w-lg py-16">
        <Card className="p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><DoorOpen className="size-7" /></span>
          <h1 className="mt-5 text-2xl font-black">Vous êtes invité</h1>
          <p className="mt-2 text-sm text-slate-400">Rejoignez cette session DuoTier privée.</p>
          <div className="mx-auto mt-5 w-fit rounded-xl bg-black/30 px-4 py-2 font-mono font-bold tracking-widest">{code.toUpperCase()}</div>
          <form action={async (formData) => { "use server"; await joinSessionAction({}, formData); }} className="mt-7">
            <input type="hidden" name="code" value={code.toUpperCase()} />
            <Button type="submit" className="w-full">Rejoindre la session</Button>
          </form>
          <Link href="/dashboard" className={`${buttonVariants({ variant: "ghost" })} mt-2 w-full`}>Retour au dashboard</Link>
        </Card>
      </div>
    </AppShell>
  );
}
