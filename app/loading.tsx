import { LoadingState } from "@/components/loading-state";

export default function Loading() {
  return <main className="grid min-h-screen place-items-center"><LoadingState label="Chargement de DuoTier…" /></main>;
}
