/* eslint-disable @next/next/no-img-element -- Native image URLs are decoded directly for the shared board's PNG export. Local catalog artwork is already WebP. */
"use client";
import { ImageOff, Layers, ScanEye } from "lucide-react";
import { useEffect, useState } from "react";
import { GAME_LABELS } from "@/lib/character-catalog";
import { characterFor, itemTitle, itemVariant } from "@/lib/tier-helpers";
import type { TierItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TierItemCard({ item, selected, onInspect }: { item: TierItem; selected?: boolean; onInspect?: () => void }) {
  const character = characterFor(item);
  const variant = itemVariant(item);
  const image = variant?.image ?? item.game?.cover_url;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);
  return <article className={cn("court-card group overflow-hidden rounded-sm border bg-[#211b18] transition duration-300", selected ? "border-primary ring-1 ring-primary/40" : "border-[#82664b]/40 hover:border-[#df735a]")}>
    <button type="button" onClick={onInspect} aria-label={`Examiner ${itemTitle(item)}`} className="focus-ring relative block w-full text-left">
      <div className={cn("relative overflow-hidden bg-[#24201d]", character ? "aspect-[4/5]" : "aspect-[4/3]")}>
        {image && !failed ? <img src={image} alt={itemTitle(item)} loading="lazy" onError={() => setFailed(true)} className={cn("h-full w-full transition duration-500 group-hover:scale-105", character ? "object-contain" : "object-cover")} /> : <div className="flex h-full items-center justify-center text-stone-500"><ImageOff className="size-8" /></div>}
        <span className="absolute right-1.5 top-1.5 rounded bg-black/60 p-1 text-[#ead9b8] opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"><ScanEye className="size-3.5" /></span>
        {character && character.variants.length > 1 && <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-[#f4e6c8]"><Layers className="size-2.5" />{character.variants.length}</span>}
      </div>
      <div className="px-2 pb-2 pt-2"><h3 className="truncate text-xs font-semibold text-[#f4eddd]" title={itemTitle(item)}>{itemTitle(item)}</h3><p className="mt-1 truncate text-[9px] uppercase tracking-[0.08em] text-[#bbaa89]">{character ? GAME_LABELS[character.game] : item.game?.genre ?? "Jeu vidéo"}</p></div>
    </button>
  </article>;
}
