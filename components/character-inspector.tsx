/* eslint-disable @next/next/no-img-element -- Native image URLs preserve full-resolution artwork and arbitrary zoom without resampling. */
"use client";
import { ExternalLink, Maximize2, Shield, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GAME_LABELS } from "@/lib/character-catalog";
import { characterFor, itemTitle, itemVariant } from "@/lib/tier-helpers";
import type { TierDefinition, TierItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function CharacterInspector({ item, config, busy, onClose, onMove, onVariant }: { item: TierItem; config: TierDefinition[]; busy: boolean; onClose: () => void; onMove: (tier: string) => void; onVariant: (id: string) => void }) {
  const character = characterFor(item);
  const chosen = itemVariant(item);
  const [previewId, setPreviewId] = useState(chosen?.id);
  const [enlarged, setEnlarged] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [background, setBackground] = useState("dark");
  const [reveal, setReveal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inspectorRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1279px)").matches) inspectorRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }, [item.id]);
  useEffect(() => { setPreviewId(chosen?.id); setReveal(false); setZoom(1); }, [item.id, chosen?.id]);
  const variant = character?.variants.find((entry) => entry.id === previewId) ?? chosen;
  const source = variant?.image ?? item.game?.cover_url;
  const locked = !!variant?.spoiler && !reveal;
  useEffect(() => setImageError(false), [source]);
  const art = (large: boolean) => <div className={cn("relative overflow-auto rounded-xl border border-white/10", background === "light" ? "text-[#262c22]" : "text-[#f0e8d7]", large ? "h-[60vh]" : "h-72 sm:h-80")} style={{ background: background === "light" ? "#e4ddc9" : background === "gray" ? "#707368" : "#161d18" }}>
    {locked ? <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center"><Shield className="size-8 text-[#c9ae78]" /><p className="text-sm">Ce visuel peut révéler une évolution du personnage.</p><Button variant="secondary" size="sm" onClick={() => setReveal(true)}>Révéler ce visuel</Button></div> :
      source && !imageError ? <img src={source} alt={`${itemTitle(item)} — ${variant?.label ?? "Illustration"}`} onError={() => setImageError(true)} className="h-full w-full object-contain" style={large ? { width: `${zoom * 100}%`, height: `${zoom * 100}%`, maxWidth: "none" } : undefined} /> :
      <div className="flex h-full items-center justify-center p-6 text-center text-sm">Visuel indisponible. Consultez la source pour le retrouver.</div>}
    {!large && !locked && <Button variant="secondary" size="icon" onClick={() => setEnlarged(true)} aria-label="Agrandir le visuel" className="absolute bottom-3 right-3"><Maximize2 className="size-4" /></Button>}
  </div>;
  return <aside ref={inspectorRef} className="panel scroll-mt-36 rounded-2xl p-4 xl:sticky xl:top-24" aria-label="Fiche du personnage">
    <div className="mb-4 flex items-start justify-between gap-2"><div><p className="eyebrow">Sous toutes les coutures</p><h2 className="display-font mt-2 text-3xl text-[#f2e9d4]">{itemTitle(item)}</h2><p className="mt-1 text-xs text-[#b9a47c]">{character ? GAME_LABELS[character.game] : "Collection jeux"}</p></div><Button size="icon" variant="ghost" onClick={onClose} aria-label="Fermer la fiche"><X className="size-4" /></Button></div>
    {art(false)}
    <div className="mt-3 flex items-center justify-between"><span className="text-[10px] uppercase tracking-widest text-stone-500">Fond du visuel</span><div className="flex gap-1.5">{[["dark", "#161d18", "sombre"], ["gray", "#707368", "gris"], ["light", "#e4ddc9", "clair"]].map(([key, color, name]) => <button key={key} onClick={() => setBackground(key)} aria-label={`Fond ${name}`} aria-pressed={background === key} className={cn("size-5 rounded-full border", background === key ? "border-[#ead6ad] ring-2 ring-[#c8ad76]/30" : "border-white/20")} style={{ backgroundColor: color }} />)}</div></div>
    {character && <><p className="mt-5 text-xs font-semibold text-[#dec8a0]">{character.role}</p><p className="mt-2 text-xs leading-relaxed text-stone-400">{character.description}</p>
      <div className="mt-4 flex flex-wrap gap-1">{character.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-stone-400">{tag}</span>)}</div>
      <label className="mt-5 block text-xs text-stone-400">Visuels disponibles · {character.variants.length}<select value={variant?.id} onChange={(event) => { setPreviewId(event.target.value); setReveal(false); }} className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-[#1a2019] p-2.5 text-sm text-[#e9dfcb]">{character.variants.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}{entry.spoiler ? " · spoiler" : ""}</option>)}</select></label>
      {variant?.id !== chosen?.id && <Button className="mt-2 w-full" size="sm" disabled={busy || locked} onClick={() => variant && onVariant(variant.id)}>Utiliser ce visuel dans notre liste</Button>}
      <p className="mt-2 text-[10px] leading-relaxed text-stone-500">{character.variants.length === 1 ? "Un seul visuel documenté pour le moment." : "Le visuel utilisé dans la liste est partagé avec votre duo."}</p>
      {variant && <a href={variant.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-[#bda77b] hover:text-[#efddb5]"><ExternalLink className="mt-0.5 size-3 shrink-0" /><span>{variant.sourceType === "community" ? "Archive communautaire" : "Publication officielle"} · {variant.credit}</span></a>}
    </>}
    {!character && <p className="mt-4 text-xs leading-relaxed text-stone-400">{item.game?.description}</p>}
    <div className="mt-5 border-t border-white/10 pt-4"><label className="block text-xs text-stone-400">Placer dans un rang<select value={item.tier} disabled={busy} onChange={(event) => onMove(event.target.value)} className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-[#1a2019] p-2.5 text-sm text-[#e9dfcb]">{config.map((tier) => <option key={tier.key} value={tier.key}>{tier.label}</option>)}</select></label><p className="mt-2 text-[10px] text-stone-500">Au clic, au clavier ou par glisser-déposer.</p></div>
    <Dialog open={enlarged} onClose={() => setEnlarged(false)} title={itemTitle(item)} description={variant?.label} className="max-w-5xl">
      {art(true)}<div className="mt-3 flex items-center justify-center gap-3"><Button variant="secondary" size="icon" aria-label="Réduire" onClick={() => setZoom((value) => Math.max(1, value - .5))} disabled={zoom <= 1}><ZoomOut className="size-4" /></Button><span className="text-sm">{Math.round(zoom * 100)} %</span><Button variant="secondary" size="icon" aria-label="Zoomer" onClick={() => setZoom((value) => Math.min(4, value + .5))} disabled={zoom >= 4}><ZoomIn className="size-4" /></Button></div>
    </Dialog>
  </aside>;
}
