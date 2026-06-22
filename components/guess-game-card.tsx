"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { Gamepad2, X } from "lucide-react";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/utils";

export const GuessGameCard = memo(function GuessGameCard({ game, eliminated, onToggle }: { game: Game; eliminated: boolean; onToggle: (id: string) => void }) {
  const [imageError, setImageError] = useState(false);
  return (
    <button type="button" aria-pressed={eliminated} onClick={() => onToggle(game.id)} className={cn("focus-ring group relative overflow-hidden rounded-xl border bg-card text-left transition hover:-translate-y-0.5", eliminated ? "border-red-500/20 opacity-35 grayscale" : "border-white/10 hover:border-violet-400/40")}>
      <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-950 to-slate-900">
        {game.cover_url && !imageError ? <Image src={game.cover_url} alt="" fill sizes="(max-width:640px) 33vw, 150px" className="object-cover" onError={() => setImageError(true)} /> : <Gamepad2 className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-violet-400/30" />}
        {eliminated && <div className="absolute inset-0 grid place-items-center bg-red-950/40"><X className="size-12 text-red-400" strokeWidth={3} /></div>}
      </div>
      <p className="truncate p-2 text-[11px] font-bold sm:text-xs">{game.title}</p>
    </button>
  );
});
