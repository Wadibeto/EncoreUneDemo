"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { TierItemCard } from "@/components/tier-item-card";
import { itemTitle } from "@/lib/tier-helpers";
import type { TierItem, TierKey } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortableItem({ item, selectedId, onInspect, disabled }: { item: TierItem; selectedId?: string; onInspect: (id: string) => void; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled, data: { tier: item.tier } });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn("relative w-[102px] shrink-0 sm:w-[116px]", isDragging && "z-20 opacity-25")}>
    <TierItemCard item={item} selected={selectedId === item.id} onInspect={() => onInspect(item.id)} />
    <button {...attributes} {...listeners} disabled={disabled} aria-label={`Déplacer ${itemTitle(item)}`} className="focus-ring mt-0.5 flex h-5 w-full touch-none cursor-grab items-center justify-center rounded text-[#bbaa89]/60 hover:bg-white/5 hover:text-[#ead9b8] active:cursor-grabbing"><GripHorizontal className="h-3.5 w-5" /></button>
  </div>;
}
export function TierRow({ tierKey, label, color, items, selectedId, onInspect, disabled = false, unranked = false }: { tierKey: TierKey; label: string; color: string; items: TierItem[]; selectedId?: string; onInspect: (id: string) => void; disabled?: boolean; unranked?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `tier:${tierKey}`, disabled, data: { tier: tierKey } });
  const rgb = color.match(/[a-f\d]{2}/gi)?.map((part) => Number.parseInt(part, 16)) ?? [255, 255, 255];
  const textColor = rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114 > 155 ? "#151912" : "#ffffff";
  return <div className={cn("flex min-h-28 overflow-hidden rounded-sm border transition-colors duration-200", isOver ? "border-primary bg-primary/10" : "border-white/[.08] bg-black/10", unranked && "flex-col")}>
    <div style={unranked ? { borderBottom: `2px solid ${color}` } : { backgroundColor: color, color: textColor }} className={cn("flex shrink-0 items-center justify-center break-words p-3 text-center font-semibold", unranked ? "justify-between text-sm text-[#dac8a4]" : "court-rank w-16 flex-col gap-2 text-base sm:w-24")}><span>{label}</span><span className={cn("text-[10px] font-normal", unranked ? "text-stone-500" : "opacity-70")}>{items.length}</span></div>
    <div ref={setNodeRef} className="min-w-0 flex-1 p-2.5">
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div className="flex min-h-24 flex-wrap content-start gap-2.5">{items.map((item) => <SortableItem key={item.id} item={item} selectedId={selectedId} onInspect={onInspect} disabled={disabled} />)}{!items.length && <div className="flex min-h-24 flex-1 items-center justify-center px-4 text-center text-xs text-[#8a8e7d]">{unranked ? "Aucune carte à classer." : "Glissez une carte ici"}</div>}</div>
      </SortableContext>
    </div>
  </div>;
}
