import Image from "next/image";
import type { Profile } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

export function PlayerBadge({ profile, online = false, label }: { profile: Profile; online?: boolean; label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 py-1 pl-1 pr-3">
      <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-violet-500/25 text-xs font-bold text-violet-200">
        {profile.avatar_url ? (
          <Image src={profile.avatar_url} alt="" fill sizes="32px" className="object-cover" />
        ) : initials(profile.username)}
        <span className={cn("absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-slate-950", online ? "bg-emerald-400" : "bg-slate-500")} />
      </div>
      <span className="text-sm font-medium">{profile.username}</span>
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </div>
  );
}
