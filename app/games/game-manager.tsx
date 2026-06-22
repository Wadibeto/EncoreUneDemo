"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { LoaderCircle, Plus, Search, Trash2 } from "lucide-react";
import { deleteGameAction, saveGameAction } from "@/app/games/actions";
import { GameCard } from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Game } from "@/lib/types";

function GameForm({ game, onSaved, onDelete }: { game: Game | null; onSaved: () => void; onDelete: (game: Game) => void }) {
  const [state, action, pending] = useActionState(saveGameAction, {});
  useEffect(() => { if (state.success) onSaved(); }, [state.success, onSaved]);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={game?.id ?? ""} />
      <label className="block text-sm font-medium">Titre<Input name="title" defaultValue={game?.title} className="mt-2" required /></label>
      <label className="block text-sm font-medium">URL de l’image<Input name="cover_url" type="url" defaultValue={game?.cover_url ?? ""} className="mt-2" placeholder="https://…" /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">Année<Input name="release_year" type="number" min="1970" max="2100" defaultValue={game?.release_year ?? ""} className="mt-2" /></label>
        <label className="block text-sm font-medium">Genre<Input name="genre" defaultValue={game?.genre ?? ""} className="mt-2" /></label>
      </div>
      <label className="block text-sm font-medium">Tags séparés par des virgules<Input name="tags" defaultValue={game?.tags.join(", ") ?? ""} className="mt-2" placeholder="coop, horreur, terminé" /></label>
      <label className="block text-sm font-medium">Description<Textarea name="description" defaultValue={game?.description ?? ""} className="mt-2" /></label>
      {state.error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{state.error}</p>}
      <div className="flex gap-2">
        {game && <Button type="button" variant="danger" size="icon" onClick={() => onDelete(game)} aria-label="Supprimer"><Trash2 className="size-4" /></Button>}
        <Button type="submit" className="flex-1" disabled={pending}>{pending && <LoaderCircle className="size-4 animate-spin" />}Enregistrer</Button>
      </div>
    </form>
  );
}

export function GameManager({ games, isAdmin }: { games: Game[]; isAdmin: boolean }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Game | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Game | null>(null);
  const [deleteState, deleteAction, deletingPending] = useActionState(deleteGameAction, {});
  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase("fr");
    return games.filter((game) => `${game.title} ${game.genre} ${game.tags.join(" ")}`.toLocaleLowerCase("fr").includes(needle));
  }, [games, query]);
  useEffect(() => { if (deleteState.success) { setDeleting(null); setEditing(undefined); } }, [deleteState]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-3.5 size-4 text-slate-500" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par titre, genre ou tag…" className="pl-10" /></label>
        {isAdmin && <Button onClick={() => setEditing(null)}><Plus className="size-4" />Ajouter un jeu</Button>}
      </div>
      <p className="mt-4 text-xs text-slate-500">{filtered.length} jeu{filtered.length > 1 ? "x" : ""}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((game) => <GameCard key={game.id} game={game} onEdit={isAdmin ? setEditing : undefined} />)}</div>

      <Dialog open={editing !== undefined} onClose={() => setEditing(undefined)} title={editing ? `Modifier ${editing.title}` : "Ajouter un jeu"} description="Le catalogue est partagé par toutes les sessions.">
        <GameForm key={editing?.id ?? "new"} game={editing ?? null} onSaved={() => setEditing(undefined)} onDelete={setDeleting} />
      </Dialog>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={() => (document.getElementById("delete-game-form") as HTMLFormElement | null)?.requestSubmit()} busy={deletingPending} title="Supprimer ce jeu ?" description="La suppression est définitive et peut être refusée si le jeu est utilisé comme secret actif." />
      <form id="delete-game-form" action={deleteAction} className="hidden"><input name="id" value={deleting?.id ?? ""} readOnly /></form>
      {deleteState.error && <p className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-red-950 px-4 py-3 text-sm text-red-200 shadow-xl">{deleteState.error}</p>}
    </>
  );
}
