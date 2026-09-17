import { Gamepad2, ListOrdered } from "lucide-react";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { CreateSessionModal } from "@/components/create-session-modal";
import { EmptyState } from "@/components/empty-state";
import { JoinSessionModal } from "@/components/join-session-modal";
import { SessionCard } from "@/components/session-card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Vos parties" };

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
      <div className="flex flex-wrap items-center justify-between gap-5">
        <h1 className="display-font text-4xl text-[#ead8b8] sm:text-5xl">Vos parties</h1>
        <div className="flex flex-wrap gap-2"><JoinSessionModal /><CreateSessionModal kind="tier" /></div>
      </div>

      <section aria-labelledby="collection-title" className="court-frame relative mt-7 overflow-hidden border border-[#ead8b8]/20 bg-[#181717]">
        <div className="grid items-center gap-5 px-5 py-5 sm:grid-cols-[1fr_240px] sm:px-7 sm:py-6 lg:grid-cols-[1fr_300px]">
          <div className="relative z-10">
            <h2 id="collection-title" className="display-font text-4xl leading-none text-[#ead8b8] sm:text-5xl">Armures <span className="text-[#df735a]">&</span> DA</h2>
            <p className="mt-3 text-xs text-[#ead8b8]/70">Crown Gambit <span className="mx-1.5 text-[#df735a]">/</span> Sovereign Tower</p>
            <div className="mt-5"><CreateSessionModal kind="tier" defaultCategory="characters" triggerLabel="Classer les personnages" featured /></div>
          </div>
          <div className="flex h-36 items-center justify-center gap-3 sm:h-44 sm:gap-4">
            <figure className="court-frame relative h-full w-28 -rotate-3 overflow-hidden border border-[#df735a]/60 bg-[#241918] sm:w-32">
              <Image src="/characters/crown-gambit/3lrt6axf63k2g-0.webp" width={260} height={348} sizes="128px" alt="Aliza — Crown Gambit, illustration de Gobert" className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#181717] to-transparent px-3 pb-2 pt-6 text-xs text-[#ead8b8]">Aliza</figcaption>
            </figure>
            <figure className="court-frame relative h-full w-28 rotate-3 overflow-hidden border border-[#ead8b8]/60 bg-[#ead8b8] sm:w-32">
              <Image src="/characters/sovereign-tower/angelica-official.webp" width={260} height={348} sizes="128px" alt="Angelica — Sovereign Tower, illustration officielle" className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#181717] to-transparent px-3 pb-2 pt-6 text-xs text-[#ead8b8]">Angelica</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-5 flex items-center gap-3"><h2 className="display-font text-3xl text-[#ead8b8]">Classements</h2><span className="text-xs text-[#ead8b8]/50">{tiers.length}</span><div className="ml-2 h-px flex-1 bg-[#ead8b8]/15" /></div>
        {tiers.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tiers.map((list) => <SessionCard key={list.id} kind="tier" id={list.id} title={list.title} updatedAt={list.updated_at} category={list.category} />)}</div> : <EmptyState icon={ListOrdered} title="Aucun classement" description="Créez une tier list ou rejoignez-en une avec un code." />}
      </section>

      <section className="mt-9">
        <div className="mb-5 flex flex-wrap items-center gap-3"><h2 className="display-font text-3xl text-[#ead8b8]">Qui est-ce ?</h2><span className="text-xs text-[#ead8b8]/50">{guesses.length}</span><div className="ml-2 hidden h-px flex-1 bg-[#ead8b8]/15 sm:block" /><div className="ml-auto"><CreateSessionModal kind="guess" /></div></div>
        {guesses.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guesses.map((game) => <SessionCard key={game.id} kind="guess" id={game.id} title={game.title} updatedAt={game.updated_at} status={game.status} />)}</div> : <EmptyState icon={Gamepad2} title="Aucune partie" description="Créez une partie pour jouer à deux." />}
      </section>
    </AppShell>
  );
}
