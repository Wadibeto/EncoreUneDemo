import Link from "next/link";
import { ArrowUpRight, Clock3, Gamepad2, ListOrdered } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function SessionCard({ kind, id, title, updatedAt, status }: { kind: "tier" | "guess"; id: string; title: string; updatedAt: string; status?: string }) {
  const guess = kind === "guess";
  return (
    <Link href={guess ? `/guess/${id}` : `/tierlists/${id}`} className="group glass relative rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-white/[0.065]">
      <div className="flex items-start justify-between gap-4">
        <span className={`flex size-10 items-center justify-center rounded-xl ${guess ? "bg-sky-500/15 text-sky-300" : "bg-violet-500/15 text-violet-300"}`}>
          {guess ? <Gamepad2 className="size-5" /> : <ListOrdered className="size-5" />}
        </span>
        <ArrowUpRight className="size-4 text-slate-600 transition group-hover:text-violet-300" />
      </div>
      <h3 className="mt-5 truncate font-bold">{title}</h3>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><Clock3 className="size-3" />{formatDate(updatedAt)}</span>
        {status && <span className="rounded-full bg-white/[0.06] px-2 py-1 capitalize">{status === "waiting" ? "en attente" : status === "active" ? "en cours" : status === "finished" ? "terminée" : "abandonnée"}</span>}
      </div>
    </Link>
  );
}
