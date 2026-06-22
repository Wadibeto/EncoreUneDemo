"use client";

import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { toPng } from "html-to-image";
import { Download, ImageDown, Palette, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ALL_TIER_KEYS, DEFAULT_TIER_CONFIG } from "@/lib/constants";
import type { Profile, TierDefinition, TierItem, TierKey } from "@/lib/types";
import { useTierBoardStore } from "@/stores/tier-board-store";
import { GameCard } from "@/components/game-card";
import { PlayerBadge } from "@/components/player-badge";
import { TierRow } from "@/components/tier-row";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TierSettingsDialog } from "@/components/tier-settings-dialog";

export function TierBoard({ listId, initialItems, initialConfig, currentUser, members }: { listId: string; initialItems: TierItem[]; initialConfig: TierDefinition[]; currentUser: Profile; members: Profile[] }) {
  const supabase = useMemo(() => createClient(), []);
  const items = useTierBoardStore((state) => state.items);
  const setItems = useTierBoardStore((state) => state.setItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [online, setOnline] = useState<Set<string>>(new Set([currentUser.id]));
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tierConfig, setTierConfig] = useState<TierDefinition[]>(initialConfig.length === 10 ? initialConfig : DEFAULT_TIER_CONFIG);
  const boardRef = useRef<HTMLDivElement>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const loadItems = useCallback(async () => {
    const { data } = await supabase.from("tier_list_items").select("*, game:games(*)").eq("tier_list_id", listId).order("position");
    if (data) setItems(data as unknown as TierItem[]);
  }, [listId, setItems, supabase]);

  const loadConfig = useCallback(async () => {
    const { data } = await supabase.from("tier_lists").select("tier_config").eq("id", listId).single();
    if (Array.isArray(data?.tier_config) && data.tier_config.length === 10) setTierConfig(data.tier_config as unknown as TierDefinition[]);
  }, [listId, supabase]);

  useEffect(() => { setItems(initialItems); }, [initialItems, setItems]);
  useEffect(() => {
    const channel = supabase.channel(`tier:${listId}`, { config: { presence: { key: currentUser.id } } })
      .on("presence", { event: "sync" }, () => setOnline(new Set(Object.keys(channel.presenceState()))))
      .on("postgres_changes", { event: "*", schema: "public", table: "tier_list_items", filter: `tier_list_id=eq.${listId}` }, () => {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(loadItems, 100);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tier_lists", filter: `id=eq.${listId}` }, loadConfig)
      .subscribe(async (status) => { if (status === "SUBSCRIBED") await channel.track({ username: currentUser.username, at: new Date().toISOString() }); });
    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current); void supabase.removeChannel(channel); };
  }, [currentUser.id, currentUser.username, listId, loadConfig, loadItems, supabase]);

  const grouped = useMemo(() => Object.fromEntries(ALL_TIER_KEYS.map((key) => [key, items.filter((item) => item.tier === key).sort((a, b) => a.position - b.position)])) as Record<TierKey, TierItem[]>, [items]);

  function onDragStart(event: DragStartEvent) { setActiveId(String(event.active.id)); }
  async function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (!event.over) return;
    const active = items.find((item) => item.id === event.active.id);
    if (!active) return;
    const overId = String(event.over.id);
    const overItem = items.find((item) => item.id === overId);
    const targetTier = (overId.startsWith("tier:") ? overId.slice(5) : overItem?.tier) as TierKey | undefined;
    if (!targetTier) return;

    const without = items.filter((item) => item.id !== active.id);
    const targetItems = without.filter((item) => item.tier === targetTier).sort((a, b) => a.position - b.position);
    const targetIndex = overItem ? Math.max(0, targetItems.findIndex((item) => item.id === overItem.id)) : targetItems.length;
    targetItems.splice(targetIndex < 0 ? targetItems.length : targetIndex, 0, { ...active, tier: targetTier });
    const affectedTiers = new Set<TierKey>([active.tier, targetTier]);
    const next = without.map((item) => {
      if (!affectedTiers.has(item.tier)) return item;
      const list = item.tier === targetTier ? targetItems : without.filter((entry) => entry.tier === item.tier).sort((a, b) => a.position - b.position);
      return { ...item, position: list.findIndex((entry) => entry.id === item.id) };
    });
    const moved = { ...active, tier: targetTier, position: targetItems.findIndex((item) => item.id === active.id) };
    const merged = [...next, moved].map((item) => item.tier === targetTier ? { ...item, position: targetItems.findIndex((entry) => entry.id === item.id) } : item);
    setItems(merged);
    const changed = merged.filter((item) => affectedTiers.has(item.tier) || item.id === active.id).map(({ id, tier, position }) => ({ id, tier, position }));
    const { error } = await supabase.rpc("reorder_tier_items", { p_list_id: listId, p_items: changed });
    if (error) { toast.error("La modification n’a pas pu être enregistrée."); setItems(items); }
  }

  async function reset() {
    setResetting(true);
    const { error } = await supabase.rpc("reset_tier_list", { p_list_id: listId });
    setResetting(false); setConfirmReset(false);
    if (error) toast.error("Réinitialisation impossible."); else { await loadItems(); toast.success("Tier list réinitialisée."); }
  }

  function exportJson() {
    const data = tierConfig.map((tier) => ({ tier: tier.label, color: tier.color, games: grouped[tier.key].map((item) => item.game.title) }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "duotier-tier-list.json"; link.click(); URL.revokeObjectURL(link.href);
  }

  async function exportImage() {
    if (!boardRef.current) return;
    try { const url = await toPng(boardRef.current, { pixelRatio: 1.5, backgroundColor: "#0c0d16" }); const link = document.createElement("a"); link.href = url; link.download = "duotier-tier-list.png"; link.click(); }
    catch { toast.error("Export image impossible sur ce navigateur."); }
  }

  const activeItem = items.find((item) => item.id === activeId);
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{members.map((member) => <PlayerBadge key={member.id} profile={member} online={online.has(member.id)} />)}</div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}><Palette className="size-4" />Personnaliser</Button><Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}><RotateCcw className="size-4" />Reset</Button><Button variant="secondary" size="sm" onClick={exportJson}><Download className="size-4" />JSON</Button><Button variant="secondary" size="sm" onClick={exportImage}><ImageDown className="size-4" />Image</Button></div>
      </div>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div ref={boardRef} className="space-y-2 rounded-3xl bg-[#0c0d16] p-2 sm:p-4">
          {tierConfig.map((tier) => <TierRow key={tier.key} tierKey={tier.key} label={tier.label} color={tier.color} items={grouped[tier.key]} />)}
        </div>
        <DragOverlay>{activeItem ? <div className="w-32 rotate-2 opacity-90"><GameCard game={activeItem.game} compact /></div> : null}</DragOverlay>
      </DndContext>
      <ConfirmDialog open={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={reset} busy={resetting} title="Réinitialiser la tier list ?" description="Tous les jeux retourneront dans « À classer »." />
      <TierSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} listId={listId} config={tierConfig} onSaved={setTierConfig} />
    </>
  );
}
