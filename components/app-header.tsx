import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/login/actions";
import type { Profile } from "@/lib/types";
import { PlayerBadge } from "@/components/player-badge";

export function AppHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6">
        <Logo href="/dashboard" />
        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white">Dashboard</Link>
          <Link href="/games" className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white">Jeux</Link>
        </nav>
        <PlayerBadge profile={profile} online />
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="icon" aria-label="Se déconnecter">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
