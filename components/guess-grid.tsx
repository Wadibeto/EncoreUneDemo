"use client";

import type { Game } from "@/lib/types";
import { GuessGameCard } from "@/components/guess-game-card";

export function GuessGrid({ games, eliminated, onToggle }: { games: Game[]; eliminated: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {games.map((game) => <GuessGameCard key={game.id} game={game} eliminated={eliminated.has(game.id)} onToggle={onToggle} />)}
    </div>
  );
}
