import { create } from "zustand";
import type { TierItem } from "@/lib/types";

type TierBoardState = {
  items: TierItem[];
  setItems: (items: TierItem[]) => void;
};

export const useTierBoardStore = create<TierBoardState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
