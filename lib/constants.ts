import type { TierKey } from "@/lib/types";

export const TIERS: Array<{
  key: TierKey;
  label: string;
  color: string;
}> = [
  { key: "S", label: "S", color: "bg-rose-500" },
  { key: "A", label: "A", color: "bg-orange-500" },
  { key: "B", label: "B", color: "bg-amber-400 text-black" },
  { key: "C", label: "C", color: "bg-lime-500 text-black" },
  { key: "D", label: "D", color: "bg-cyan-500 text-black" },
  { key: "E", label: "E", color: "bg-blue-500" },
  { key: "unfinished", label: "Pas fini", color: "bg-violet-500" },
  { key: "demo", label: "Démo", color: "bg-fuchsia-500" },
  { key: "abandoned", label: "Abandonné", color: "bg-slate-600" },
];

export const ALL_TIER_KEYS = ["unranked", ...TIERS.map((tier) => tier.key)];
