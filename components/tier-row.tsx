"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { GameCard } from "@/components/game-card";
import type { TierItem, TierKey } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortableGame({ item }: { item: TierItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, data: { tier: item.tier } });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn("relative w-28 shrink-0 touch-none sm:w-32", isDragging && "z-20 opacity-30")} {...attributes} {...listeners}>
      <GameCard game={item.game} compact />
      <GripVertical className="absolute left-1 top-1 size-4 rounded bg-black/60 p-0.5 text-white/70 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}

export function TierRow({ tierKey, label, color, items }: { tierKey: TierKey; label: string; color: string; items: TierItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `tier:${tierKey}`, data: { tier: tierKey } });
  const rgb = color.match(/[a-f\d]{2}/gi)?.map((part) => Number.parseInt(part, 16)) ?? [255, 255, 255];
  const textColor = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 > 155 ? "#080b12" : "#ffffff";
  return (
    <div className={cn("flex min-h-36 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 transition", isOver && "border-violet-400/60 bg-violet-400/[0.06]")}>
      <div style={{ backgroundColor: color, color: textColor }} className="flex w-20 shrink-0 items-center justify-center break-words p-2 text-center text-sm font-black sm:w-24 sm:text-base">{label}</div>
      <div ref={setNodeRef} className="min-w-0 flex-1 p-2">
        <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="flex min-h-28 flex-wrap content-start gap-2">
            {items.map((item) => <SortableGame key={item.id} item={item} />)}
            {!items.length && <div className="flex min-h-28 flex-1 items-center justify-center text-xs text-slate-600">Déposez un jeu ici</div>}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
