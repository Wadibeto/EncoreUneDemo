"use client";
import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toPng } from "html-to-image";
import { Check, Download, ImageDown, LoaderCircle, Palette, RotateCcw, Search, Shield, Sparkles, WifiOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TIER_CONFIG, CHARACTER_TIER_CONFIG } from "@/lib/constants";
import { CATALOG_COVERAGE_NOTE } from "@/lib/character-catalog";
import { characterFor, groupItems, itemTitle, optimisticMove } from "@/lib/tier-helpers";
import type { Profile, TierCategory, TierDefinition, TierItem } from "@/lib/types";
import { PlayerBadge } from "@/components/player-badge";
import { TierRow } from "@/components/tier-row";
import { TierItemCard } from "@/components/tier-item-card";
import { CharacterInspector } from "@/components/character-inspector";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TierSettingsDialog } from "@/components/tier-settings-dialog";
import { cn } from "@/lib/utils";

export function TierBoard({ listId, initialTitle, initialItems, initialConfig, initialRevision, category, currentUser, members: initialMembers }: { listId: string; initialTitle: string; initialItems: TierItem[]; initialConfig: TierDefinition[]; initialRevision: number; category: TierCategory; currentUser: Profile; members: Profile[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState(initialTitle);
  const [revision, setRevision] = useState(initialRevision);
  const [tierConfig, setTierConfig] = useState(initialConfig.length ? initialConfig : category === "characters" ? CHARACTER_TIER_CONFIG : DEFAULT_TIER_CONFIG);
  const [members, setMembers] = useState(initialMembers);
  const [online, setOnline] = useState<Set<string>>(new Set());
  const [connection, setConnection] = useState<"connecting" | "live" | "offline">("connecting");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [query, setQuery] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const mutation = useRef(false);
  const requestVersion = useRef(0);
  const mounted = useRef(true);
  const subscribed = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const refresh = useCallback(async () => {
    if (mutation.current) return;
    const version = ++requestVersion.current;
    const [itemResult, listResult, memberResult] = await Promise.all([
      supabase.from("tier_list_items").select("*, game:games(*)").eq("tier_list_id", listId).order("position"),
      supabase.from("tier_lists").select("title,tier_config,revision").eq("id", listId).single(),
      supabase.from("tier_list_members").select("profile:profiles(*)").eq("tier_list_id", listId),
    ]);
    if (!mounted.current || version !== requestVersion.current || mutation.current) return;
    if (itemResult.error || listResult.error) { setConnection("offline"); return; }
    if (subscribed.current && navigator.onLine) setConnection("live");
    setItems(itemResult.data as unknown as TierItem[]);
    setTitle(listResult.data.title);
    setRevision(listResult.data.revision ?? 0);
    if (Array.isArray(listResult.data.tier_config)) setTierConfig(listResult.data.tier_config as TierDefinition[]);
    if (memberResult.data) setMembers(memberResult.data.flatMap((row) => row.profile ? [row.profile as unknown as Profile] : []));
  }, [listId, supabase]);

  useEffect(() => {
    mounted.current = true;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => { clearTimeout(timer); timer = setTimeout(() => { void refresh(); }, 120); };
    const channel = supabase.channel(`atelier:${listId}`, { config: { presence: { key: currentUser.id } } })
      .on("presence", { event: "sync" }, () => setOnline(new Set(Object.keys(channel.presenceState()))))
      .on("system", {}, (message) => {
        if (!mounted.current || message.extension !== "postgres_changes") return;
        subscribed.current = message.status === "ok";
        setConnection(subscribed.current ? "live" : "offline");
        if (subscribed.current) void refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tier_list_items", filter: `tier_list_id=eq.${listId}` }, schedule)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tier_lists", filter: `id=eq.${listId}` }, schedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "tier_list_members", filter: `tier_list_id=eq.${listId}` }, schedule)
      .subscribe(async (status) => {
        if (!mounted.current) return;
        if (status === "SUBSCRIBED") { await channel.track({ username: currentUser.username }); void refresh(); }
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") { subscribed.current = false; setConnection("offline"); setOnline(new Set()); }
      });
    const offline = () => { setConnection("offline"); setOnline(new Set()); };
    const focus = () => { if (document.visibilityState === "visible") void refresh(); };
    window.addEventListener("offline", offline); window.addEventListener("online", schedule); document.addEventListener("visibilitychange", focus);
    const poll = setInterval(() => { if (document.visibilityState === "visible") void refresh(); }, 15000);
    return () => { mounted.current = false; subscribed.current = false; clearTimeout(timer); clearInterval(poll); window.removeEventListener("offline", offline); window.removeEventListener("online", schedule); document.removeEventListener("visibilitychange", focus); void supabase.removeChannel(channel); };
  }, [currentUser.id, currentUser.username, listId, refresh, supabase]);

  const grouped = useMemo(() => groupItems(items, tierConfig), [items, tierConfig]);
  const selected = items.find((item) => item.id === selectedId);
  const unranked = tierConfig.find((tier) => tier.key === "unranked") ?? DEFAULT_TIER_CONFIG[9];
  const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  const filtered = grouped.unranked.filter((item) => {
    const character = characterFor(item);
    return normalizeSearch([itemTitle(item), character?.role, ...(character?.tags ?? [])].join(" ")).includes(normalizeSearch(query)) && (gameFilter === "all" || character?.game === gameFilter);
  });
  const rankedCount = items.length - grouped.unranked.length;
  const disabled = busy || connection !== "live";

  async function mutate(action: () => PromiseLike<{ error: { message: string } | null }>, optimistic?: () => void) {
    if (mutation.current || connection !== "live") { toast.error("Attendez que la connexion soit rétablie."); return; }
    mutation.current = true; requestVersion.current++; setBusy(true); optimistic?.();
    try { const { error } = await action(); if (error) toast.error("La modification n’a pas été enregistrée. Le classement partagé va être rechargé."); }
    catch { toast.error("Connexion interrompue. Vérification du classement enregistré…"); }
    finally { mutation.current = false; if (mounted.current) { await refresh(); setBusy(false); } }
  }
  async function move(id: string, tier: string, before: string | null = null) {
    await mutate(() => supabase.rpc("move_tier_item", { p_list_id: listId, p_item_id: id, p_target_tier: tier, p_before_item_id: before }), () => setItems((current) => optimisticMove(current, id, tier, before)));
  }
  async function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (!event.over || event.active.id === event.over.id) return;
    const overId = String(event.over.id);
    const over = items.find((item) => item.id === overId);
    const tier = overId.startsWith("tier:") ? overId.slice(5) : over?.tier;
    if (tier) await move(String(event.active.id), tier, over?.id ?? null);
  }
  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportJson() {
    download(new Blob([JSON.stringify({ format: "duotier-v2", title, category, exportedAt: new Date().toISOString(), tiers: tierConfig.map((tier) => ({ ...tier, items: grouped[tier.key].map((item) => ({ name: itemTitle(item), game_id: item.game_id, character_id: item.character_id, variant_id: item.variant_id, position: item.position })) })) }, null, 2)], { type: "application/json" }), "duotier-classement.json");
  }
  async function exportImage() {
    if (!boardRef.current) return;
    setExporting(true);
    try {
      await Promise.all(Array.from(boardRef.current.querySelectorAll("img")).map((img) => img.decode().catch(() => undefined)));
      const data = await toPng(boardRef.current, { pixelRatio: 1.5, backgroundColor: "#141a15", filter: (node) => !(node instanceof HTMLElement && node.dataset.export === "hide") });
      const link = document.createElement("a"); link.href = data; link.download = "duotier-classement.png"; link.click();
    } catch { toast.error("L’export image a échoué. L’export JSON reste disponible."); }
    finally { setExporting(false); }
  }
  const active = items.find((item) => item.id === activeId);
  return <>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{category === "characters" ? "L’atelier · Armures & direction artistique" : "La collection · Jeux vidéo"}</p><h1 className="display-font mt-3 text-4xl leading-tight text-[#f4ead7] sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400">{category === "characters" ? "Une silhouette. Une armure. Un coup de cœur. Regardez de près, confrontez vos goûts et composez votre classement à deux." : "Vos aventures partagées méritent un classement à votre image."}</p></div><div className="flex items-baseline gap-2"><span className="display-font text-4xl text-[#c8ad76]">{rankedCount}</span><span className="text-xs text-stone-500">/ {items.length} classés</span></div></div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-4">
      <div className="flex flex-wrap items-center gap-3"><div className="flex gap-2">{members.map((member) => <PlayerBadge key={member.id} profile={member} online={online.has(member.id)} />)}</div><span role="status" className={cn("flex items-center gap-1.5 text-[10px]", connection === "live" ? "text-[#abc299]" : "text-amber-300")}>{connection === "live" ? busy ? <LoaderCircle className="size-3 animate-spin" /> : <Check className="size-3" /> : <WifiOff className="size-3" />}{busy ? "Enregistrement…" : connection === "live" ? "Synchronisation en direct" : connection === "connecting" ? "Connexion…" : "Reconnexion · modifications suspendues"}</span></div>
      <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)} disabled={disabled}><Palette className="size-3.5" />Personnaliser</Button><Button variant="ghost" size="sm" onClick={exportJson} aria-label="Exporter en JSON"><Download className="size-3.5" />JSON</Button><Button variant="ghost" size="sm" onClick={exportImage} disabled={exporting}>{exporting ? <LoaderCircle className="size-3.5 animate-spin" /> : <ImageDown className="size-3.5" />}Image</Button><Button variant="ghost" size="icon" onClick={() => setConfirmReset(true)} disabled={disabled} aria-label="Réinitialiser le classement"><RotateCcw className="size-3.5" /></Button></div>
    </div>
    <div className={cn("grid items-start gap-5", selected ? "xl:grid-cols-[minmax(0,1fr)_340px]" : "xl:grid-cols-[minmax(0,1fr)_270px]")}>
      <div className="min-w-0">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveId(String(e.active.id))} onDragCancel={() => setActiveId(null)} onDragEnd={onDragEnd}>
          <div ref={boardRef} className="space-y-2 rounded-2xl bg-[#141a15] p-2 sm:p-3">
            <div className="flex items-center justify-between px-2 pb-3 pt-1"><h2 className="display-font text-xl text-[#e7d9bd]">{title}</h2><span className="eyebrow">DuoTier</span></div>
            {tierConfig.filter((tier) => tier.key !== "unranked").map((tier) => <TierRow key={tier.key} tierKey={tier.key} label={tier.label} color={tier.color} items={grouped[tier.key] ?? []} selectedId={selectedId} onInspect={setSelectedId} disabled={disabled} />)}
          </div>
          <section className="mt-6" aria-label="Cartes à classer"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">La réserve</p><p className="mt-1 text-xs text-stone-500">Cliquez pour examiner · poignée pour déplacer</p></div><div className="flex max-w-full flex-wrap gap-2"><label className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-stone-500" /><input aria-label="Rechercher dans la réserve" placeholder="Un nom, un coup de cœur…" value={query} onChange={(e) => setQuery(e.target.value)} className="focus-ring h-9 w-52 max-w-full rounded-lg border border-white/10 bg-black/15 pl-9 pr-3 text-xs" /></label>{category === "characters" && <select aria-label="Filtrer la réserve par jeu" value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} className="focus-ring h-9 rounded-lg border border-white/10 bg-[#1a2019] px-2 text-xs"><option value="all">Les deux univers</option><option value="crown-gambit">Crown Gambit</option><option value="sovereign-tower">Sovereign Tower</option></select>}</div></div><TierRow tierKey="unranked" label={unranked.label} color={unranked.color} items={filtered} selectedId={selectedId} onInspect={setSelectedId} disabled={disabled} unranked /></section>
          <DragOverlay>{active ? <div className="w-[116px] rotate-3 opacity-90"><TierItemCard item={active} /></div> : null}</DragOverlay>
        </DndContext>
      </div>
      {selected ? <CharacterInspector item={selected} config={tierConfig} busy={disabled} onClose={() => setSelectedId(undefined)} onMove={(tier) => { void move(selected.id, tier); }} onVariant={(id) => { void mutate(() => supabase.rpc("set_tier_item_variant", { p_list_id: listId, p_item_id: selected.id, p_variant_id: id })); }} /> : <aside className="panel rounded-2xl p-6 xl:sticky xl:top-24"><Shield className="mb-6 size-7 text-[#b99c64]" /><p className="eyebrow">Le sens du détail</p><h2 className="display-font mt-3 text-3xl leading-tight text-[#eaddc3]">Prenez le temps<br />de regarder.</h2><p className="mt-4 text-xs leading-relaxed text-stone-400">Ouvrez une carte pour explorer son illustration, changer le fond et choisir votre visuel préféré.</p><div className="my-6 h-px bg-white/10" /><div className="flex gap-2 text-[#c0aa81]"><Sparkles className="mt-0.5 size-4 shrink-0" /><p className="text-xs leading-relaxed">Silhouette, palette, matières, détails : à vous de définir ce qui fait un grand design.</p></div><p className="mt-6 text-[10px] leading-relaxed text-stone-500">Les classements, les visuels choisis et les réglages sont communs. Votre recherche, votre zoom et votre fiche restent personnels.</p></aside>}
    </div>
    {category === "characters" && <p className="mt-8 max-w-3xl text-[11px] leading-relaxed text-stone-500">{CATALOG_COVERAGE_NOTE} Illustrations © leurs ayants droit.</p>}
    <ConfirmDialog open={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={async () => { await mutate(() => supabase.rpc("reset_tier_list", { p_list_id: listId })); setConfirmReset(false); }} busy={busy} title="Repartir d’une page blanche ?" description="Toutes les cartes retourneront dans la réserve pour vous deux. Vos rangs, couleurs et visuels seront conservés." />
    <TierSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} listId={listId} title={title} config={tierConfig} revision={revision} category={category} onSaved={refresh} />
  </>;
}
