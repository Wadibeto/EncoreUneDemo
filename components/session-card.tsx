import Link from "next/link";
import { ArrowUpRight, Clock3, Gamepad2, Shield, Swords } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function SessionCard({ kind, id, title, updatedAt, status, category = "games" }: {
  kind: "tier" | "guess"; id: string; title: string; updatedAt: string; status?: string; category?: "games" | "characters";
}) {
  const guess = kind === "guess";
  const characters = !guess && category === "characters";
  const Icon = guess ? Swords : characters ? Shield : Gamepad2;
  return (
    <Link href={guess ? `/guess/${id}` : `/tierlists/${id}`} className="focus-ring group relative flex min-h-48 flex-col rounded-xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-[#8f8058] hover:bg-[#242a1e]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-black/10 text-primary"><Icon className="size-5" strokeWidth={1.4} /></span>
        <span className="eyebrow mt-1 ml-auto text-[9px]">{guess ? "Qui est-ce ?" : characters ? "Armures & DA" : "Collection de jeux"}</span>
        <ArrowUpRight className="mt-1 size-4 text-slate-500 transition group-hover:text-primary" />
      </div>
      <h3 className="display-font mt-6 break-words text-2xl leading-7">{title}</h3>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5"><Clock3 className="size-3" />{formatDate(updatedAt)}</span>
        {status && <span className="rounded-full border border-border px-2 py-1">{status === "waiting" ? "En attente" : status === "active" ? "En cours" : status === "finished" ? "Terminée" : "Abandonnée"}</span>}
        {!guess && <span className="text-primary">Reprendre le classement →</span>}
      </div>
    </Link>
  );
}
