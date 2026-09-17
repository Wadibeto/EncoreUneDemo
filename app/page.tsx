import Link from "next/link";
import { ArrowUpRight, Gamepad2, Swords } from "lucide-react";
import { Logo } from "@/components/logo";
import { CourtShowcase } from "@/components/court-showcase";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-10 lg:px-14">
        <Logo />
        <span className="hidden text-[9px] uppercase tracking-[.3em] text-[#9a8976] md:block">Le conseil est ouvert</span>
        <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "!rounded-none")}>Connexion <ArrowUpRight className="size-3.5" /></Link>
      </header>
      <CourtShowcase />
      <nav aria-label="Autres modes de jeu" className="mx-auto mb-12 grid max-w-[1328px] border-y border-border sm:grid-cols-2">
        <Link href="/login" className="focus-ring group flex items-center gap-5 px-6 py-7 transition duration-300 hover:bg-[#b35437]/10 sm:border-r sm:border-border sm:px-10"><Gamepad2 className="size-6 text-primary" strokeWidth={1.2} /><div><h2 className="display-font text-3xl">Nos jeux</h2><p className="mt-1 text-[11px] text-[#a99b88]">Reprendre les classements.</p></div><ArrowUpRight className="ml-auto size-5 text-[#a99b88] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
        <Link href="/login" className="focus-ring group flex items-center gap-5 border-t border-border px-6 py-7 transition duration-300 hover:bg-[#b35437]/10 sm:border-t-0 sm:px-10"><Swords className="size-6 text-primary" strokeWidth={1.2} /><div><h2 className="display-font text-3xl">Qui est-ce ?</h2><p className="mt-1 text-[11px] text-[#a99b88]">Un jeu secret. À vous de le trouver.</p></div><ArrowUpRight className="ml-auto size-5 text-[#a99b88] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
      </nav>
      <footer className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-3 px-5 pb-7 text-[9px] uppercase tracking-[.15em] text-[#8d8171] sm:px-10 lg:px-14"><span>DuoTier</span><span>Crown Gambit & Sovereign Tower · WILD WITS</span></footer>
    </main>
  );
}
