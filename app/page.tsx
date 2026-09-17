import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Crown, Eye, Gamepad2, Layers3, Palette, Radio, Shield, Sparkles, Swords, Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { number: "01", icon: Eye, title: "Le goût du détail.", text: "Ouvrez les illustrations des personnages, parcourez les vues disponibles et prenez le temps de regarder." },
  { number: "02", icon: Palette, title: "Votre classement, vos règles.", text: "Renommez les rangs, changez les couleurs, ajoutez une catégorie. L’atelier s’adapte à vos critères." },
  { number: "03", icon: Users, title: "Le débat en direct.", text: "Partagez le code avec votre duo. Les placements et les réglages se retrouvent dans le même espace." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex min-h-24 max-w-[1440px] items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-10 lg:px-14">
        <Logo />
        <nav aria-label="Navigation" className="hidden items-center gap-8 text-xs text-slate-400 md:flex"><a href="#collections" className="focus-ring rounded-sm hover:text-primary">Les collections</a><a href="#atelier" className="focus-ring rounded-sm hover:text-primary">L’esprit de l’atelier</a></nav>
        <Link href="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>Ouvrir l’atelier <ArrowUpRight className="size-3.5" /></Link>
      </header>

      <section className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 py-16 sm:px-10 sm:py-20 lg:min-h-[720px] lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-14">
        <div className="relative z-10">
          <p className="eyebrow flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" /> Le grand classement des petits désaccords</p>
          <h1 className="display-font mt-7 text-[clamp(3.25rem,6vw,6rem)] leading-[.99]">À deux,<br />le goût du<br /><em className="text-primary">classement.</em></h1>
          <p className="mt-7 max-w-[390px] text-sm leading-7 text-slate-400 sm:text-base">Vos jeux cultes. Leurs plus belles armures. Des avis bien tranchés. Composez un panthéon qui n’appartient qu’à vous.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/login?mode=register" className={cn(buttonVariants({ size: "lg" }), "group")}>Créer notre classement <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" /></Link>
            <Link href="/login" className="focus-ring rounded-sm text-xs text-slate-400 underline decoration-slate-700 underline-offset-4 hover:text-primary">J’ai déjà un compte</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[.11em] text-slate-500"><span className="flex items-center gap-1.5"><Radio className="size-3 text-[#a5b78a]" />En temps réel</span><span className="flex items-center gap-1.5"><Check className="size-3 text-primary" />Entièrement personnalisable</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-[570px] pt-6 lg:pt-0">
          <div aria-hidden="true" className="ornament-ring absolute -left-10 -top-6 aspect-square w-[115%]"><div className="ornament-ring absolute inset-10" /><div className="ornament-ring absolute inset-20" /></div>
          <div className="relative -rotate-2 rounded-xl border border-[#a8a184]/40 bg-[#dedcc9] p-5 text-[#293122] shadow-2xl shadow-black/50 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-3 border-b border-[#70775d]/25 pb-5">
              <div><p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#686e57]">Le carnet des favoris · 001</p><h2 className="display-font mt-2 text-3xl">Armures & caractères</h2></div>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#71775f]/40"><Crown className="size-4" strokeWidth={1.2} /></span>
            </div>
            {[
              { rank: "S", label: "Légendaire", color: "#899273", portraits: [{ name: "Aliza", image: "/characters/crown-gambit/3lrt6axf63k2g-0.webp" }, { name: "Hael", image: "/characters/crown-gambit/3lrt6axf63k2g-2.webp" }] },
              { rank: "A", label: "Remarquable", color: "#b3ad8d", portraits: [{ name: "Angelica", image: "/characters/sovereign-tower/angelica-official.webp" }] },
              { rank: "B", label: "À débattre", color: "#bb9d7f", portraits: [{ name: "Rollo", image: "/characters/crown-gambit/3lrt6axf63k2g-1.webp" }] },
            ].map(({ rank, label, color, portraits }) => (
              <div key={rank} className="mb-2 flex min-h-[100px] overflow-hidden rounded-md border border-[#8e9279]/25 bg-[#b5b7a3]/15">
                <div style={{ backgroundColor: color }} className="flex w-[64px] shrink-0 flex-col items-center justify-center gap-1 sm:w-[82px]"><span className="display-font text-3xl">{rank}</span><span className="text-[7px] font-semibold uppercase tracking-wide">{label}</span></div>
                <div className="flex flex-1 gap-2 p-2">
                  {portraits.map(({ name, image }) => <div key={name} className="w-20 shrink-0 overflow-hidden rounded-sm border border-[#6e7658]/30 bg-[#20231d] text-[#d9dbc3]"><Image src={image} width={160} height={168} sizes="80px" alt={name + " — illustration officielle"} className="h-[84px] w-full object-cover object-top" /><span className="block px-1 py-1.5 text-center text-[8px] uppercase tracking-[.08em]">{name}</span></div>)}
                  {rank === "B" && <div className="flex flex-1 items-center justify-center border border-dashed border-[#8e9279]/30 text-[9px] italic text-[#777e67]">La suite se décide à deux.</div>}
                </div>
              </div>
            ))}
            <div className="mt-5 flex items-center justify-between gap-2 text-[8px] uppercase tracking-[.12em] text-[#666e56]"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#67824b]" />Votre duo est dans l’atelier</span><span>Exemple de classement</span></div>
          </div>
          <div className="relative -mt-1 ml-auto mr-3 flex w-fit rotate-3 items-center gap-3 rounded-lg border border-[#7c815f] bg-[#313b28] px-5 py-4 shadow-xl">
            <div className="flex size-8 items-center justify-center rounded-full border border-primary/40"><Users className="size-4 text-primary" /></div><div><p className="display-font text-xl">Deux avis. Un panthéon.</p><p className="mt-1 text-[9px] tracking-wide text-slate-400">Et le droit de changer d’avis.</p></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1330px] border-y border-border px-5 py-5 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-4 text-[9px] uppercase tracking-[.2em] text-slate-500"><span>La collection s’agrandit</span><span className="flex items-center gap-2 text-slate-300"><Shield className="size-3.5 text-primary" />Crown Gambit</span><span className="flex items-center gap-2 text-slate-300"><Crown className="size-3.5 text-primary" />Sovereign Tower</span><a href="#collections" className="focus-ring flex items-center gap-2 rounded-sm text-primary">Explorer <ArrowDown className="size-3" /></a></div></div>

      <section id="collections" className="mx-auto max-w-[1440px] scroll-mt-8 px-5 py-20 sm:px-10 lg:px-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Les collections</p><h2 className="display-font mt-3 text-4xl sm:text-5xl">À chacun ses obsessions.</h2></div><p className="max-w-xs text-xs leading-6 text-slate-400">Deux façons de classer. Mille bonnes raisons de ne pas être d’accord.</p></div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Link href="/login" className="focus-ring atelier-feature group relative overflow-hidden rounded-xl px-6 py-8 sm:px-9 sm:py-10">
            <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[48%] overflow-hidden sm:block"><Image src="/characters/crown-gambit/3lrt6axf63k2g-0.webp" width={600} height={800} sizes="(max-width: 640px) 1px, 400px" alt="" className="h-full w-full object-cover object-top opacity-60" /><div className="absolute inset-0 bg-gradient-to-r from-[#22271b] via-[#22271b]/30 to-transparent" /></div>
            <div className="relative"><span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-2.5 py-1 text-[8px] uppercase tracking-[.15em] text-primary"><Sparkles className="size-3" />Nouvelle collection</span><h3 className="display-font mt-9 text-4xl sm:text-5xl">L’armure fait-elle<br /><em>le personnage ?</em></h3><p className="mt-5 max-w-[315px] text-sm leading-7 text-slate-400">Crown Gambit, Sovereign Tower. Les personnages, leurs designs et l’art de choisir ses favoris.</p><div className="mt-8 flex items-center gap-3 text-xs font-semibold text-primary">Explorer les armures & la DA <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div></div>
          </Link>
          <div className="grid gap-5">
            <Link href="/login" className="focus-ring group rounded-xl border border-border bg-card p-6 sm:px-8"><div className="flex justify-between text-primary"><Gamepad2 className="size-5" strokeWidth={1.3} /><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="display-font mt-5 text-3xl">Vos aventures partagées.</h3><p className="mt-3 max-w-sm text-xs leading-6 text-slate-400">Les jeux terminés, les belles surprises, les rendez-vous manqués. Votre histoire mérite sa tier list.</p></Link>
            <Link href="/login" className="focus-ring group rounded-xl border border-border bg-card p-6 sm:px-8"><div className="flex justify-between text-primary"><Swords className="size-5" strokeWidth={1.3} /><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="display-font mt-5 text-3xl">Une dernière devinette ?</h3><p className="mt-3 max-w-sm text-xs leading-6 text-slate-400">Lancez un Qui est-ce ? avec votre catalogue de jeux et démasquez le choix secret de votre ami.</p></Link>
          </div>
        </div>
      </section>

      <section id="atelier" className="mx-auto max-w-[1440px] scroll-mt-8 px-5 pb-20 sm:px-10 lg:px-14">
        <div className="atelier-rule" /><div className="grid gap-10 pt-10 md:grid-cols-3 md:gap-12">{features.map(({ number, icon: Icon, title, text }) => <article key={number}><div className="flex items-center justify-between"><span className="eyebrow">{number} / L’esprit de l’atelier</span><Icon className="size-5 text-primary" strokeWidth={1.2} /></div><h2 className="display-font mt-6 text-3xl">{title}</h2><p className="mt-3 text-xs leading-7 text-slate-400">{text}</p></article>)}</div>
      </section>
      <footer className="mx-auto flex max-w-[1330px] flex-wrap items-center justify-between gap-5 border-t border-border px-5 py-8 text-[9px] uppercase tracking-[.15em] text-slate-500 sm:px-8"><span className="flex items-center gap-2"><Layers3 className="size-4 text-primary" />DuoTier · L’art de ne pas être d’accord</span><span>Votre collection. Vos règles.</span></footer>
    </main>
  );
}
