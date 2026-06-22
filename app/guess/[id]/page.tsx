import { notFound, redirect } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GuessSession } from "@/components/guess-session";
import { InviteCode } from "@/components/invite-code";
import { createClient } from "@/lib/supabase/server";
import type { Game, GuessPlayer, Profile } from "@/lib/types";

export default async function GuessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: session }, { data: games }, { data: players }, { data: secret }, { data: eliminations }, { data: note }, { data: profile }] = await Promise.all([
    supabase.from("guess_sessions").select("*").eq("id", id).single(),
    supabase.from("games").select("*").order("title"),
    supabase.from("guess_players").select("session_id,user_id,player_number,ready,profile:profiles(*)").eq("session_id", id).order("player_number"),
    supabase.from("guess_player_secrets").select("secret_game_id,game:games(*)").eq("session_id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("guess_eliminations").select("game_id").eq("session_id", id).eq("user_id", user.id),
    supabase.from("guess_notes").select("content").eq("session_id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);
  if (!session || !games || !players || !profile) notFound();
  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="flex items-center gap-2 text-sm font-semibold text-sky-300"><Gamepad2 className="size-4" />Qui est-ce ? jeux vidéo</p><h1 className="mt-2 text-3xl font-black">{session.title}</h1><p className="mt-2 text-xs text-slate-500">Manche {session.round || 1} · Les secrets ne transitent jamais vers l’adversaire</p></div><InviteCode code={session.invite_code} /></div>
      <GuessSession
        initialSession={session}
        games={games as Game[]}
        initialPlayers={players as unknown as GuessPlayer[]}
        currentUser={profile as Profile}
        initialSecret={secret?.game ? secret.game as unknown as Game : null}
        initialEliminations={(eliminations ?? []).map((row) => row.game_id)}
        initialNote={note?.content ?? ""}
      />
    </AppShell>
  );
}
