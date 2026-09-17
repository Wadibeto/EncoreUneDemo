import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/login/actions";
import type { Profile } from "@/lib/types";
import { PlayerBadge } from "@/components/player-badge";

export function AppHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[78px] max-w-[1440px] flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-8 lg:px-12">
        <Logo href="/dashboard" />
        <span aria-hidden="true" className="ml-3 hidden h-6 w-px bg-border lg:block" />
        <nav aria-label="Navigation principale" className="order-3 flex w-full gap-6 border-t border-border pt-3 text-xs sm:order-none sm:ml-3 sm:w-auto sm:border-0 sm:pt-0">
          <Link href="/dashboard" className="focus-ring rounded-sm py-1 text-foreground transition hover:text-primary">L’atelier</Link>
          <Link href="/games" className="focus-ring rounded-sm py-1 text-slate-400 transition hover:text-primary">Collection de jeux</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="max-w-[150px] overflow-hidden sm:max-w-[220px]"><PlayerBadge profile={profile} online /></div>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Se déconnecter" title="Se déconnecter"><LogOut className="size-4" /></Button>
          </form>
        </div>
      </div>
    </header>
  );
}
