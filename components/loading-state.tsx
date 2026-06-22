export function LoadingState({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-400">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-700 border-t-violet-400" />
      {label}
    </div>
  );
}
