import { Gamepad2, ListOrdered, Shield, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { CreateSessionModal } from "@/components/create-session-modal";
import { EmptyState } from "@/components/empty-state";
import { JoinSessionModal } from "@/components/join-session-modal";
import { SessionCard } from "@/components/session-card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "L’atelier" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: tierMemberships }, { data: guessMemberships }] = await Promise.all([
    supabase.from("tier_list_members").select("tier_list:tier_lists(id,title,updated_at,category)").eq("user_id", user.id).order("joined_at", { ascending: false }),
    supabase.from("guess_players").select("session:guess_sessions(id,title,status,updated_at)").eq("user_id", user.id).order("joined_at", { ascending: false }),
  ]);

  const tiers = (tierMemberships ?? []).flatMap((row) => row.tier_list ? [row.tier_list as unknown as { id: string; title: string; updated_at: string; category: "games" | "characters" }] : []);
  const guesses = (guessMemberships ?? []).flatMap((row) => row.session ? [row.session as unknown as { id: string; title: string; status: string; updated_at: string }] : []);

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Votre espace partagé</p>
          <h1 className="display-font mt-4 text-5xl leading-none sm:text-6xl">Bienvenue à l’atelier.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400">Des jeux, des coups de cœur et quelques débats. À vous d’écrire le classement.</p>
        </div>
        <div className="flex flex-wrap gap-2"><JoinSessionModal /><CreateSessionModal kind="tier" /></div>
      </div>

      <section aria-labelledby="collection-title" className="atelier-feature relative mt-10 overflow-hidden rounded-2xl">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 size-[650px]">
          <div className="ornament-ring absolute inset-0" /><div className="ornament-ring absolute inset-14" /><div className="ornament-ring absolute inset-28" />
          <div className="absolute inset-0 m-auto h-full w-px rotate-45 bg-primary/10" /><div className="absolute inset-0 m-auto h-full w-px -rotate-45 bg-primary/10" />
        </div>
        <div className="relative grid gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow flex items-center gap-2"><Sparkles className="size-3" /> Nouvelle collection · Armures & direction artistique</p>
            <h2 id="collection-title" className="display-font mt-5 text-[44px] leading-[1.06] sm:text-6xl">Le style mérite<br />son propre <em className="text-[#d8c393]">classement.</em></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#bcc2ad]">Les silhouettes de Crown Gambit et Sovereign Tower entrent dans l’arène. Observez leurs designs, comparez les détails et couronnez vos favoris.</p>
            <div className="mt-7"><CreateSessionModal kind="tier" defaultCategory="characters" triggerLabel="Classer les personnages" featured /></div>
            <p className="mt-3 text-[10px] tracking-wide text-slate-400">Illustrations & portraits · Sources créditées · À deux, en direct</p>
          </div>
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="paper-card w-[46%] max-w-[190px] -rotate-6 rounded-t-[90px] rounded-b-xl p-5 text-center shadow-2xl">
              <span className="text-[8px] font-semibold uppercase tracking-[.2em]">Collection I</span>
              <div className="relative mx-auto my-4 aspect-[3/4] max-w-[130px] overflow-hidden rounded-t-full border border-[#686f50]/30 bg-[#202020]">
                <Image src="/characters/crown-gambit/3lrt6axf63k2g-0.webp" width={260} height={348} sizes="130px" alt="Aliza — Crown Gambit, illustration de Gobert" className="h-full w-full object-cover" />
              </div>
              <p className="display-font text-2xl leading-none">Crown<br />Gambit</p>
              <div className="mx-auto mt-4 w-6 border-t border-[#8b8c70]" />
              <p className="mt-3 text-[8px] uppercase tracking-[.16em]">Reliques & serments</p>
            </div>
            <div className="mt-10 w-[46%] max-w-[190px] rotate-6 rounded-t-[90px] rounded-b-xl border border-[#7e8a64] bg-[#313e2e] p-5 text-center shadow-2xl">
              <span className="text-[8px] font-semibold uppercase tracking-[.2em] text-[#c3cfaf]">Collection II</span>
              <div className="relative mx-auto my-4 aspect-[3/4] max-w-[130px] overflow-hidden rounded-t-full border border-primary/30 bg-[#d4ba90]">
                <Image src="/characters/sovereign-tower/angelica-official.webp" width={260} height={348} sizes="130px" alt="Angelica — Sovereign Tower, illustration officielle" className="h-full w-full object-cover" />
              </div>
              <p className="display-font text-2xl leading-none text-[#e7e4ce]">Sovereign<br />Tower</p>
              <div className="mx-auto mt-4 w-6 border-t border-primary/40" />
              <p className="mt-3 text-[8px] uppercase tracking-[.16em] text-[#c3cfaf]">Chevaliers & légendes</p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-x-8 gap-y-3 border-t border-[#4a4f37] px-6 py-4 text-[10px] tracking-wide text-slate-300 sm:px-9">
          <span className="flex items-center gap-2"><Shield className="size-3.5 text-primary" />Personnages & variantes</span>
          <span className="flex items-center gap-2"><ListOrdered className="size-3.5 text-primary" />Rangs, noms et couleurs libres</span>
          <span className="flex items-center gap-2"><Users className="size-3.5 text-primary" />Un atelier partagé en direct</span>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center gap-3"><span className="eyebrow">01</span><h2 className="display-font text-3xl">Vos classements</h2><span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-slate-400">{tiers.length}</span><div className="ml-2 h-px flex-1 bg-border" /></div>
        {tiers.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tiers.map((list) => <SessionCard key={list.id} kind="tier" id={list.id} title={list.title} updatedAt={list.updated_at} category={list.category} />)}</div> : <EmptyState icon={ListOrdered} title="La page est encore blanche" description="Votre premier classement commence ici. Créez une tier list et invitez votre duo." />}
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-center gap-3"><span className="eyebrow">02</span><h2 className="display-font text-3xl">À vous de deviner</h2><span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-slate-400">{guesses.length}</span><div className="ml-2 hidden h-px flex-1 bg-border sm:block" /><div className="ml-auto"><CreateSessionModal kind="guess" /></div></div>
        {guesses.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guesses.map((game) => <SessionCard key={game.id} kind="guess" id={game.id} title={game.title} updatedAt={game.updated_at} status={game.status} />)}</div> : <EmptyState icon={Gamepad2} title="Un duel, ça vous dit ?" description="Retrouvez le jeu mystère de votre ami dans une partie de Qui est-ce ?" />}
      </section>
    </AppShell>
  );
}
