"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { Gamepad2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/utils";

export const GameCard = memo(function GameCard({ game, onEdit, compact = false }: { game: Game; onEdit?: (game: Game) => void; compact?: boolean }) {
  const [imageError, setImageError] = useState(false);
  return (
    <article className={cn("group relative overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:-translate-y-0.5 hover:border-violet-400/30", compact && "rounded-xl")}>
      <div className={cn("relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-950 to-slate-900", compact && "aspect-[4/3]")}>
        {game.cover_url && !imageError ? (
          <Image src={game.cover_url} alt={`Illustration de ${game.title}`} fill sizes={compact ? "160px" : "(max-width: 640px) 50vw, 280px"} className="object-cover transition duration-300 group-hover:scale-105" onError={() => setImageError(true)} />
        ) : (
          <div className="flex h-full items-center justify-center"><Gamepad2 className="size-10 text-violet-400/40" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {onEdit && <Button type="button" variant="secondary" size="icon" className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100" onClick={() => onEdit(game)} aria-label={`Modifier ${game.title}`}><Pencil className="size-4" /></Button>}
      </div>
      <div className={cn("p-4", compact && "p-2.5")}>
        <h3 className={cn("truncate font-bold", compact && "text-xs")}>{game.title}</h3>
        {!compact && <>
          <p className="mt-1 text-xs text-slate-500">{[game.genre, game.release_year].filter(Boolean).join(" · ") || "Informations à compléter"}</p>
          {game.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{game.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-slate-400">{tag}</span>)}</div>}
        </>}
      </div>
    </article>
  );
});
