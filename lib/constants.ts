import type { TierDefinition } from "@/lib/types";

export const DEFAULT_TIER_CONFIG: TierDefinition[] = [
  { key: "S", label: "S", color: "#f43f5e" },
  { key: "A", label: "A", color: "#f97316" },
  { key: "B", label: "B", color: "#facc15" },
  { key: "C", label: "C", color: "#84cc16" },
  { key: "D", label: "D", color: "#06b6d4" },
  { key: "E", label: "E", color: "#3b82f6" },
  { key: "unfinished", label: "Pas fini", color: "#8b5cf6" },
  { key: "demo", label: "Démo", color: "#d946ef" },
  { key: "abandoned", label: "Abandonné", color: "#475569" },
  { key: "unranked", label: "À classer", color: "#1e293b" },
];

export const TIERS = DEFAULT_TIER_CONFIG.filter((tier) => tier.key !== "unranked");
export const ALL_TIER_KEYS = DEFAULT_TIER_CONFIG.map((tier) => tier.key);
