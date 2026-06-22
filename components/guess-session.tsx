"use client";

import { Eye, Flag, Hourglass, LoaderCircle, MessageSquareText, Play, RotateCcw, SkipForward, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Game, GuessPlayer, Profile } from "@/lib/types";
import { GuessGrid } from "@/components/guess-grid";
import { PlayerBadge } from "@/components/player-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Session = { id: string; status: "waiting" | "active" | "finished" | "abandoned"; current_turn: string | null; winner_id: string | null; round: number };

export function GuessSession({ initialSession, games, initialPlayers, currentUser, initialSecret, initialEliminations, initialNote }: {
  initialSession: Session;
  games: Game[];
  initialPlayers: GuessPlayer[];
  currentUser: Profile;
  initialSecret: Game | null;
  initialEliminations: string[];
  initialNote: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState(initialSession);
  const [players, setPlayers] = useState(initialPlayers);
  const [secret, setSecret] = useState(initialSecret);
  const [eliminated, setEliminated] = useState(new Set(initialEliminations));
  const [note, setNote] = useState(initialNote);
  const [online, setOnline] = useState(new Set([currentUser.id]));
  const [guessOpen, setGuessOpen] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState("");
  const [busy, setBusy] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const noteHydrated = useRef(false);

  const refresh = useCallback(async () => {
    const [{ data: nextSession }, { data: playerRows }, { data: secretRow }] = await Promise.all([
      supabase.from("guess_sessions").select("id,status,current_turn,winner_id,round").eq("id", initialSession.id).single(),
      supabase.from("guess_players").select("session_id,user_id,player_number,ready,profile:profiles(*)").eq("session_id", initialSession.id).order("player_number"),
      supabase.from("guess_player_secrets").select("secret_game_id,game:games(*)").eq("session_id", initialSession.id).eq("user_id", currentUser.id).maybeSingle(),
    ]);
    if (nextSession) setSession(nextSession as Session);
    if (playerRows) setPlayers(playerRows as unknown as GuessPlayer[]);
    setSecret(secretRow?.game ? secretRow.game as unknown as Game : null);
  }, [currentUser.id, initialSession.id, supabase]);

  useEffect(() => {
    const channel = supabase.channel(`guess:${initialSession.id}`, { config: { presence: { key: currentUser.id } } })
      .on("presence", { event: "sync" }, () => setOnline(new Set(Object.keys(channel.presenceState()))))
      .on("postgres_changes", { event: "*", schema: "public", table: "guess_sessions", filter: `id=eq.${initialSession.id}` }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "guess_players", filter: `session_id=eq.${initialSession.id}` }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "guess_player_secrets", filter: `session_id=eq.${initialSession.id}` }, refresh)
      .subscribe(async (status) => { if (status === "SUBSCRIBED") await channel.track({ username: currentUser.username }); });
    return () => { void supabase.removeChannel(channel); };
  }, [currentUser.id, currentUser.username, initialSession.id, refresh, supabase]);

  useEffect(() => {
    if (!noteHydrated.current) { noteHydrated.current = true; return; }
    const timer = setTimeout(async () => {
      const { error } = await supabase.from("guess_notes").upsert({ session_id: session.id, user_id: currentUser.id, content: note }, { onConflict: "session_id,user_id" });
      if (error) toast.error("Les notes n’ont pas pu être sauvegardées.");
    }, 500);
    return () => clearTimeout(timer);
  }, [currentUser.id, note, session.id, supabase]);

  const opponent = players.find((player) => player.user_id !== currentUser.id);
  const myTurn = session.status === "active" && session.current_turn === currentUser.id;
  const remaining = games.filter((game) => !eliminated.has(game.id));

  async function toggle(gameId: string) {
    const removing = eliminated.has(gameId);
    setEliminated((current) => { const next = new Set(current); if (removing) next.delete(gameId); else next.add(gameId); return next; });
    const query = removing
      ? supabase.from("guess_eliminations").delete().eq("session_id", session.id).eq("user_id", currentUser.id).eq("game_id", gameId)
      : supabase.from("guess_eliminations").insert({ session_id: session.id, user_id: currentUser.id, game_id: gameId });
    const { error } = await query;
    if (error) { setEliminated((current) => { const next = new Set(current); if (removing) next.add(gameId); else next.delete(gameId); return next; }); toast.error("Élimination non sauvegardée."); }
  }

  async function startRound() {
    setBusy(true);
    const { error } = await supabase.rpc("start_guess_round", { p_session_id: session.id });
    if (!error) { setEliminated(new Set()); setNote(""); await refresh(); }
    setBusy(false);
    if (error) toast.error(error.message.includes("Two players") ? "Il faut deux joueurs pour commencer." : "Impossible de lancer la manche.");
  }

  async function guess() {
    if (!selectedGuess) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("make_guess", { p_session_id: session.id, p_game_id: selectedGuess });
    setBusy(false); setGuessOpen(false);
    if (error) toast.error(error.message.includes("turn") ? "Ce n’est pas votre tour." : "La proposition a échoué.");
    else { if (data) toast.success("Bonne réponse, victoire !"); else toast.error("Mauvaise réponse. Tour adverse."); await refresh(); }
  }

  async function pass() {
    setBusy(true); const { error } = await supabase.rpc("pass_guess_turn", { p_session_id: session.id }); setBusy(false);
    if (error) toast.error("Impossible de passer le tour."); else await refresh();
  }

  async function abandon() {
    setBusy(true); const { error } = await supabase.rpc("abandon_guess_session", { p_session_id: session.id }); setBusy(false); setAbandonOpen(false);
    if (error) toast.error("Abandon impossible."); else await refresh();
  }

  return (
    <>
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">{players.map((player) => <PlayerBadge key={player.user_id} profile={player.profile} online={online.has(player.user_id)} label={session.current_turn === player.user_id ? "à son tour" : undefined} />)}{players.length < 2 && <div className="flex items-center gap-2 rounded-full border border-dashed border-white/10 px-4 text-xs text-slate-500"><Hourglass className="size-3.5" />En attente du joueur 2</div>}</div>
        <div className="flex flex-wrap gap-2">
          {session.status !== "active" && <Button onClick={startRound} disabled={busy || players.length < 2}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : session.round ? <RotateCcw className="size-4" /> : <Play className="size-4" />}{session.round ? "Nouvelle manche" : "Commencer"}</Button>}
          {session.status === "active" && <><Button variant="secondary" onClick={pass} disabled={!myTurn || busy}><SkipForward className="size-4" />Passer</Button><Button onClick={() => setGuessOpen(true)} disabled={!myTurn || busy}><Eye className="size-4" />Je devine</Button><Button variant="ghost" onClick={() => setAbandonOpen(true)}><Flag className="size-4" />Abandonner</Button></>}
        </div>
      </div>

      {(session.status === "finished" || session.status === "abandoned") && <div className={`mb-6 rounded-2xl border p-5 ${session.winner_id === currentUser.id ? "border-emerald-400/20 bg-emerald-400/10" : "border-rose-400/20 bg-rose-400/10"}`}><Trophy className="inline size-5" /> <span className="ml-2 font-bold">{session.winner_id === currentUser.id ? "Vous remportez la manche !" : `${opponent?.profile.username ?? "Votre adversaire"} remporte la manche.`}</span></div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <section><div className="mb-3 flex items-end justify-between"><div><h2 className="font-bold">Votre grille</h2><p className="text-xs text-slate-500">Cliquez pour éliminer. Vos choix restent privés.</p></div><span className="text-xs text-slate-500">{remaining.length}/{games.length} restants</span></div><GuessGrid games={games} eliminated={eliminated} onToggle={toggle} /></section>
        <aside className="space-y-4">
          <div className="glass rounded-2xl p-4"><p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Votre jeu secret</p>{secret ? <div className="mt-3 overflow-hidden rounded-xl"><div className="relative aspect-video bg-violet-950">{secret.cover_url ? <Image src={secret.cover_url} alt="" fill sizes="268px" className="object-cover" /> : null}</div><p className="bg-black/30 p-3 text-center font-bold">{secret.title}</p></div> : <p className="mt-4 text-sm text-slate-500">Il sera tiré au lancement de la manche.</p>}</div>
          <div className="glass rounded-2xl p-4"><label className="flex items-center gap-2 text-sm font-bold"><MessageSquareText className="size-4 text-sky-400" />Notes privées</label><Textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-3" placeholder="Questions posées, indices, hypothèses…" maxLength={5000} /><p className="mt-2 text-[10px] text-slate-600">Sauvegarde automatique · visible uniquement par vous</p></div>
        </aside>
      </div>

      <Dialog open={guessOpen} onClose={() => setGuessOpen(false)} title="Quelle est votre réponse ?" description="Une erreur passe immédiatement le tour à votre adversaire.">
        <select value={selectedGuess} onChange={(event) => setSelectedGuess(event.target.value)} className="focus-ring h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm"><option value="">Choisir un jeu…</option>{remaining.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)}</select>
        <Button className="mt-4 w-full" onClick={guess} disabled={!selectedGuess || busy}>{busy && <LoaderCircle className="size-4 animate-spin" />}Valider ma réponse</Button>
      </Dialog>
      <ConfirmDialog open={abandonOpen} onClose={() => setAbandonOpen(false)} onConfirm={abandon} busy={busy} title="Abandonner la manche ?" description="Votre adversaire sera déclaré vainqueur." />
    </>
  );
}
