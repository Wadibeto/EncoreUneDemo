"use client";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DEFAULT_TIER_CONFIG, CHARACTER_TIER_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { TierCategory, TierDefinition } from "@/lib/types";

export function TierSettingsDialog({ open, onClose, listId, title, config, revision, category, onSaved }: { open: boolean; onClose: () => void; listId: string; title: string; config: TierDefinition[]; revision: number; category: TierCategory; onSaved: () => Promise<void> }) {
  const supabase = useMemo(() => createClient(), []);
  const [draft, setDraft] = useState<TierDefinition[]>(config);
  const [draftTitle, setDraftTitle] = useState(title);
  const [baseRevision, setBaseRevision] = useState(revision);
  const [busy, setBusy] = useState(false);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) { setDraft(config.map((tier) => ({ ...tier }))); setDraftTitle(title); setBaseRevision(revision); }
    wasOpen.current = open;
  }, [config, open, revision, title]);
  function reload() { setDraft(config.map((tier) => ({ ...tier }))); setDraftTitle(title); setBaseRevision(revision); }
  function update(index: number, values: Partial<TierDefinition>) { setDraft((current) => current.map((tier, i) => i === index ? { ...tier, ...values } : tier)); }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.length || draft[target].key === "unranked") return;
    setDraft((current) => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  }
  async function save() {
    if (draftTitle.trim().length < 2 || draft.some((tier) => !tier.label.trim())) { toast.error("Donnez un titre à la liste et un nom à chaque rang."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.rpc("update_tier_settings", { p_list_id: listId, p_title: draftTitle.trim(), p_config: draft.map((tier) => ({ ...tier, label: tier.label.trim() })), p_expected_revision: baseRevision });
      if (error) { await onSaved(); toast.error(error.message.toLowerCase().includes("conflict") || error.message.toLowerCase().includes("changed") ? "Votre duo a modifié les réglages. Rechargez sa version avant de réessayer." : "Enregistrement impossible. Réessayez après la synchronisation."); return; }
      await onSaved(); onClose(); toast.success("Les réglages sont enregistrés pour votre duo.");
    } catch { toast.error("Connexion interrompue. Vos réglages restent dans cette fenêtre."); }
    finally { setBusy(false); }
  }
  const stale = revision !== baseRevision;
  return <Dialog open={open} onClose={busy ? () => {} : onClose} title="Votre liste, vos règles." description="Noms, couleurs, ordre : composez le classement qui vous ressemble. Les réglages enregistrés sont partagés en direct." className="max-w-2xl">
    <fieldset disabled={busy} className="space-y-5">
      <label className="block text-xs font-semibold text-stone-400">Titre de la tier list<Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} maxLength={80} className="mt-2" /></label>
      {stale && <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">Votre duo a modifié les réglages pendant votre édition. Votre brouillon est conservé.<Button className="mt-2" size="sm" variant="secondary" onClick={reload}>Recharger les réglages partagés</Button></div>}
      <div className="space-y-2">{draft.map((tier, index) => <div key={tier.key} className="flex items-center gap-2 rounded-xl border border-white/[.07] bg-black/15 p-2">
        <input type="color" value={tier.color} onChange={(e) => update(index, { color: e.target.value })} className="size-9 shrink-0 cursor-pointer rounded bg-transparent" aria-label={`Couleur de ${tier.label}`} />
        <Input value={tier.label} onChange={(e) => update(index, { label: e.target.value })} maxLength={32} aria-label={`Nom du rang ${tier.key}`} className="h-9 min-w-0 flex-1" />
        {tier.key !== "unranked" ? <div className="flex shrink-0">
          <Button variant="ghost" size="icon" className="size-7" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Monter ${tier.label}`}><ArrowUp className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7" onClick={() => move(index, 1)} disabled={index >= draft.length - 2} aria-label={`Descendre ${tier.label}`}><ArrowDown className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7 text-rose-300" onClick={() => setDraft((current) => current.filter((entry) => entry.key !== tier.key))} disabled={draft.length <= 2} aria-label={`Retirer ${tier.label}`}><Trash2 className="size-3.5" /></Button>
        </div> : <span className="w-[84px] text-center text-[9px] text-stone-500">Réserve</span>}
      </div>)}</div>
      <Button variant="secondary" size="sm" disabled={draft.length >= 21} onClick={() => setDraft((current) => [...current.filter((tier) => tier.key !== "unranked"), { key: `rank_${crypto.randomUUID().slice(0, 8)}`, label: "Nouveau rang", color: "#9caa88" }, ...current.filter((tier) => tier.key === "unranked")])}><Plus className="size-4" />Ajouter un rang <span className="text-stone-500">({draft.length - 1}/20)</span></Button>
      <p className="text-xs leading-relaxed text-stone-500">Retirer un rang replace ses cartes dans la réserve. Aucune carte n’est supprimée. La réserve reste toujours disponible.</p>
      <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4"><Button variant="ghost" size="sm" onClick={() => setDraft((category === "characters" ? CHARACTER_TIER_CONFIG : DEFAULT_TIER_CONFIG).map((tier) => ({ ...tier })))}><RotateCcw className="size-3.5" />Rangs par défaut</Button><Button onClick={save} disabled={busy || stale}>{busy && <LoaderCircle className="size-4 animate-spin" />}Enregistrer pour le duo</Button></div>
    </fieldset>
  </Dialog>;
}
