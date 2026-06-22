"use client";

import { ArrowDown, ArrowUp, LoaderCircle, Palette, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DEFAULT_TIER_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { TierDefinition } from "@/lib/types";

function cloneDefaults() {
  return DEFAULT_TIER_CONFIG.map((tier) => ({ ...tier }));
}

export function TierSettingsDialog({
  open,
  onClose,
  listId,
  config,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  listId: string;
  config: TierDefinition[];
  onSaved: (config: TierDefinition[]) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [draft, setDraft] = useState<TierDefinition[]>(config);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setDraft(config.map((tier) => ({ ...tier })));
  }, [config, open]);

  function update(index: number, values: Partial<TierDefinition>) {
    setDraft((current) => current.map((tier, itemIndex) => itemIndex === index ? { ...tier, ...values } : tier));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    if (draft.some((tier) => !tier.label.trim())) {
      toast.error("Chaque ligne doit avoir un nom.");
      return;
    }
    setBusy(true);
    const normalized = draft.map((tier) => ({ ...tier, label: tier.label.trim() }));
    const { error } = await supabase.rpc("update_tier_config", {
      p_list_id: listId,
      p_config: normalized,
    });
    setBusy(false);
    if (error) {
      toast.error("La personnalisation n’a pas pu être enregistrée.");
      return;
    }
    onSaved(normalized);
    onClose();
    toast.success("Apparence de la tier list enregistrée.");
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Personnaliser les lignes"
      description="Modifiez les noms, les couleurs et l’ordre. Les changements sont partagés avec votre duo."
    >
      <div className="space-y-2">
        {draft.map((tier, index) => (
          <div key={tier.key} className="grid grid-cols-[44px_1fr_auto] items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 p-2">
            <label className="relative size-10 cursor-pointer overflow-hidden rounded-lg border border-white/10" style={{ backgroundColor: tier.color }} title="Changer la couleur">
              <Palette className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow" />
              <input
                type="color"
                value={tier.color}
                onChange={(event) => update(index, { color: event.target.value })}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label={`Couleur de ${tier.label}`}
              />
            </label>
            <Input
              value={tier.label}
              onChange={(event) => update(index, { label: event.target.value })}
              maxLength={32}
              aria-label={`Nom de la ligne ${tier.key}`}
              className="h-10"
            />
            <div className="flex">
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Monter la ligne"><ArrowUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => move(index, 1)} disabled={index === draft.length - 1} aria-label="Descendre la ligne"><ArrowDown className="size-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-2">
        <Button type="button" variant="ghost" onClick={() => setDraft(cloneDefaults())} disabled={busy}><RotateCcw className="size-4" />Valeurs par défaut</Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>Annuler</Button>
          <Button type="button" onClick={save} disabled={busy}>{busy && <LoaderCircle className="size-4 animate-spin" />}Enregistrer</Button>
        </div>
      </div>
    </Dialog>
  );
}
