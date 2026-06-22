import Link from "next/link";
import { ArrowRight, Gamepad2, ListOrdered, Radio, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { icon: ListOrdered, title: "Tier lists à deux", text: "Glissez, classez et débattez en temps réel." },
  { icon: Swords, title: "Qui est-ce ? gaming", text: "Éliminez les jeux et trouvez le secret adverse." },
  { icon: Radio, title: "Synchronisé", text: "Chaque action est sauvegardée et partagée instantanément." },
  { icon: ShieldCheck, title: "Secrets protégés", text: "RLS et stockage séparé empêchent toute fuite côté client." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <Link href="/login" className={buttonVariants({ variant: "secondary" })}>Connexion</Link>
      </header>

      <section className="relative mx-auto grid min-h-[74vh] max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
            <Sparkles className="size-3.5" /> Votre backlog devient un terrain de jeu
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.05em] sm:text-7xl">
            Classez vos jeux. <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">Défiez votre duo.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            DuoTier est votre espace privé pour trancher le classement ultime et lancer un « Qui est-ce ? » avec les jeux que vous avez vécus ensemble.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login?mode=register" className={cn(buttonVariants({ size: "lg" }), "group")}>
              Créer votre duo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/dashboard" className={buttonVariants({ variant: "secondary", size: "lg" })}>Ouvrir le dashboard</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-16 -z-10 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="glass rotate-1 rounded-3xl p-5 shadow-2xl shadow-black/50">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-xs text-slate-500">Tier list</p><p className="font-bold">Nos classiques</p></div>
              <div className="flex -space-x-2"><span className="size-8 rounded-full border-2 border-slate-900 bg-violet-500" /><span className="size-8 rounded-full border-2 border-slate-900 bg-sky-500" /></div>
            </div>
            {[
              ["S", "bg-rose-500", ["Portal 2", "It Takes Two", "Minecraft"]],
              ["A", "bg-orange-500", ["Lethal Company", "Terraria"]],
              ["B", "bg-amber-400 text-black", ["Phasmophobia", "Valheim"]],
            ].map(([tier, color, games]) => (
              <div key={tier as string} className="mb-2 flex min-h-20 overflow-hidden rounded-xl bg-black/25">
                <div className={cn("flex w-16 shrink-0 items-center justify-center text-2xl font-black", color as string)}>{tier as string}</div>
                <div className="flex flex-wrap items-center gap-2 p-2">
                  {(games as string[]).map((game) => <span key={game} className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium">{game}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="glass rounded-2xl p-5">
            <Icon className="size-5 text-violet-400" />
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
          </article>
        ))}
      </section>
      <footer className="border-t border-white/[0.06] py-8 text-center text-sm text-slate-500"><Gamepad2 className="mr-2 inline size-4" />DuoTier · Conçu pour deux</footer>
    </main>
  );
}
