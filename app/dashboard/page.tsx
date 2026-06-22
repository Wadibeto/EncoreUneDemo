import { Gamepad2, LayoutDashboard, ListOrdered } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreateSessionModal } from "@/components/create-session-modal";
import { EmptyState } from "@/components/empty-state";
import { JoinSessionModal } from "@/components/join-session-modal";
import { SessionCard } from "@/components/session-card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: tierMemberships }, { data: guessMemberships }] = await Promise.all([
    supabase.from("tier_list_members").select("tier_list:tier_lists(id,title,updated_at)").eq("user_id", user.id).order("joined_at", { ascending: false }),
    supabase.from("guess_players").select("session:guess_sessions(id,title,status,updated_at)").eq("user_id", user.id).order("joined_at", { ascending: false }),
  ]);

  const tiers = (tierMemberships ?? []).flatMap((row) => row.tier_list ? [row.tier_list as unknown as { id: string; title: string; updated_at: string }] : []);
  const guesses = (guessMemberships ?? []).flatMap((row) => row.session ? [row.session as unknown as { id: string; title: string; status: string; updated_at: string }] : []);

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><p className="flex items-center gap-2 text-sm font-semibold text-violet-300"><LayoutDashboard className="size-4" />Espace privé</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Votre terrain de jeu</h1><p className="mt-2 text-slate-400">Reprenez un classement ou lancez un nouveau duel.</p></div>
        <div className="flex flex-wrap gap-2"><JoinSessionModal /><CreateSessionModal kind="guess" /><CreateSessionModal kind="tier" /></div>
      </div>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-3"><ListOrdered className="size-5 text-violet-400" /><h2 className="text-xl font-bold">Mes tier lists</h2><span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-slate-400">{tiers.length}</span></div>
        {tiers.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tiers.map((list) => <SessionCard key={list.id} kind="tier" id={list.id} title={list.title} updatedAt={list.updated_at} />)}</div> : <EmptyState icon={ListOrdered} title="Aucune tier list" description="Créez votre premier classement et invitez votre duo." />}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-3"><Gamepad2 className="size-5 text-sky-400" /><h2 className="text-xl font-bold">Mes parties Qui est-ce ?</h2><span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-slate-400">{guesses.length}</span></div>
        {guesses.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guesses.map((game) => <SessionCard key={game.id} kind="guess" id={game.id} title={game.title} updatedAt={game.updated_at} status={game.status} />)}</div> : <EmptyState icon={Gamepad2} title="Aucune partie" description="Créez un duel et partagez le code à votre ami." />}
      </section>
    </AppShell>
  );
}
