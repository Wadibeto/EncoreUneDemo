import { CHARACTERS } from "@/lib/character-catalog";
import type { TierDefinition, TierItem } from "@/lib/types";

export function characterFor(item: TierItem) { return CHARACTERS.find((character) => character.id === item.character_id); }
export function itemTitle(item: TierItem) { return characterFor(item)?.name ?? item.game?.title ?? "Personnage indisponible"; }
export function itemVariant(item: TierItem) {
  const character = characterFor(item);
  return character?.variants.find((variant) => variant.id === item.variant_id) ?? character?.variants[0];
}
export function groupItems(items: TierItem[], config: TierDefinition[]) {
  const grouped: Record<string, TierItem[]> = Object.fromEntries(config.map((tier) => [tier.key, []]));
  grouped.unranked ??= [];
  for (const item of items) (grouped[item.tier] ?? grouped.unranked).push(item);
  for (const group of Object.values(grouped)) group.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  return grouped;
}
export function optimisticMove(items: TierItem[], id: string, targetTier: string, beforeId: string | null) {
  const active = items.find((item) => item.id === id);
  if (!active || id === beforeId) return items;
  const rest = items.filter((item) => item.id !== id);
  const target = rest.filter((item) => item.tier === targetTier).sort((a, b) => a.position - b.position);
  const index = beforeId ? target.findIndex((item) => item.id === beforeId) : -1;
  target.splice(index < 0 ? target.length : index, 0, { ...active, tier: targetTier });
  const source = rest.filter((item) => item.tier === active.tier && item.tier !== targetTier).sort((a, b) => a.position - b.position);
  const unaffected = rest.filter((item) => item.tier !== active.tier && item.tier !== targetTier);
  return [...unaffected, ...source.map((item, position) => ({ ...item, position })), ...target.map((item, position) => ({ ...item, position }))];
}
