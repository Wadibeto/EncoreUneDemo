"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Swords } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const courts = [
  {
    name: "Crown Gambit", mark: "I", color: "#1f1f1f",
    characters: [
      { name: "Aliza", image: "/characters/crown-gambit/3lrt6axf63k2g-0.webp", role: "Paladine du sang", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g" },
      { name: "Hael", image: "/characters/crown-gambit/3lrt6axf63k2g-2.webp", role: "Paladin", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g" },
      { name: "Rollo", image: "/characters/crown-gambit/3lrt6axf63k2g-1.webp", role: "Paladin", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3lrt6axf63k2g" },
    ],
  },
  {
    name: "Sovereign Tower", mark: "II", color: "#edd8bf",
    characters: [
      { name: "Angelica", image: "/characters/sovereign-tower/angelica-artist.webp", role: "Chevalière de Clovermont", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3mf5la2htm22w" },
      { name: "Gideon", image: "/characters/sovereign-tower/gideon-artist.webp", role: "Chevalier · duelliste", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3mgxhief6f22x" },
      { name: "Gwendan", image: "/characters/sovereign-tower/gwendan-artist.webp", role: "Chevalier de Villador", source: "https://bsky.app/profile/gobertillu.bsky.social/post/3mfmqjk3u2s2p" },
    ],
  },
];

export function CourtShowcase() {
  const [courtIndex, setCourtIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const court = courts[courtIndex];
  const character = court.characters[characterIndex];

  return (
    <section className="relative mx-auto grid max-w-[1440px] gap-9 px-5 pb-12 pt-10 sm:px-10 lg:min-h-[780px] lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-10 lg:px-14 lg:py-12">
      <div className="relative z-10">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[.22em] text-[#beaa8e]"><Swords className="size-4 text-primary" strokeWidth={1.2} />Crown Gambit × Sovereign Tower</p>
        <h1 className="display-font mt-7 text-[clamp(3.6rem,7vw,7.5rem)] leading-[.9]">À vous<br />de <em className="text-primary">régner.</em></h1>
        <p className="mt-7 max-w-[300px] text-sm leading-7 text-[#beb3a3]">Classez les jeux, les personnages<br />et leurs armures. À deux.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/login?mode=register" className={cn(buttonVariants({ size: "lg" }), "group !rounded-none")}>Créer une tier list <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
          <Link href="/login" className="focus-ring text-xs text-foreground underline decoration-[#635448] underline-offset-4 hover:text-primary">Rejoindre mon duo</Link>
        </div>

        <div className="mt-10 border-t border-[#514337] pt-6 lg:mt-14">
          <div className="flex gap-1" role="group" aria-label="Choisir un univers">
            {courts.map((entry, index) => <button key={entry.name} type="button" aria-pressed={courtIndex === index} onClick={() => { setCourtIndex(index); setCharacterIndex(0); }} className={cn("focus-ring flex-1 border px-3 py-3 text-[10px] uppercase tracking-[.08em] transition duration-300 sm:flex-none sm:px-5", courtIndex === index ? "border-[#d9c7a7] bg-[#d9c7a7] text-[#231c18]" : "border-[#514337] text-[#bcb0a0] hover:border-primary hover:text-foreground")}><span className="mr-2 opacity-50">{entry.mark}</span>{entry.name}</button>)}
          </div>
          <div className="mt-4 flex gap-3" role="group" aria-label="Choisir un personnage à regarder">
            {court.characters.map((entry, index) => <button key={entry.name} type="button" onClick={() => setCharacterIndex(index)} aria-pressed={characterIndex === index} aria-label={`Regarder ${entry.name}`} className={cn("focus-ring group relative w-[76px] border transition duration-300 hover:-translate-y-1", characterIndex === index ? "border-primary" : "border-[#514337] hover:border-[#bc9c76]")}>
              <div className="h-[76px] overflow-hidden bg-[#27211d]"><Image src={entry.image} alt="" width={152} height={152} sizes="76px" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110" /></div>
              <span className={cn("block border-t px-1 py-1.5 text-[10px]", characterIndex === index ? "border-primary bg-primary text-[#211510]" : "border-[#514337] bg-[#211b18] text-[#d7c6ad]")}>{entry.name}</span>
            </button>)}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[570px] px-3 sm:px-7">
        <div aria-hidden="true" className="absolute -left-2 top-8 h-[78%] w-full -rotate-[5deg] border border-[#9f5c45]/40 bg-[#3b201b]/30 transition duration-700" />
        <div aria-hidden="true" className="absolute -right-1 top-6 h-[80%] w-full rotate-[4deg] border border-[#bb9f70]/30 bg-[#3a2c23]/30" />
        <div className="group relative border border-[#a78e69] p-2 sm:p-3">
          <span aria-hidden="true" className="absolute -left-1.5 -top-1.5 size-3 rotate-45 border border-[#d8c09a] bg-background" /><span aria-hidden="true" className="absolute -right-1.5 -top-1.5 size-3 rotate-45 border border-[#d8c09a] bg-background" /><span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-3 rotate-45 border border-[#d8c09a] bg-background" /><span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 size-3 rotate-45 border border-[#d8c09a] bg-background" />
          <div className="relative overflow-hidden" style={{ backgroundColor: court.color }}>
            <div key={character.image} className="court-enter relative aspect-[4/5]">
              <Image src={character.image} alt={`${character.name} — ${court.name}, illustration de Gobert`} width={1000} height={1250} sizes="(max-width: 640px) 85vw, (max-width: 1024px) 500px, 42vw" priority={courtIndex === 0 && characterIndex === 0} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-[#f1e4cc] sm:bottom-6 sm:left-6 sm:right-6">
              <div><p className="text-[8px] uppercase tracking-[.2em] text-[#ceaa8a]">{court.name}</p><h2 className="display-font mt-1 text-4xl sm:text-5xl">{character.name}</h2><p className="mt-1 text-[10px] text-[#c5b6a2]">{character.role}</p></div>
              <div className="flex size-12 shrink-0 items-center justify-center border border-[#cbb188]/50 bg-[#1b1410]/50"><Crown className="size-6 text-[#d7b786]" strokeWidth={1} /></div>
            </div>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between gap-3 text-[8px] uppercase tracking-[.15em] text-[#9f927f]"><a href={character.source} target="_blank" rel="noreferrer" className="focus-ring transition hover:text-foreground">Illustration © Gobert · WILD WITS ↗</a><span>0{characterIndex + 1} / 03</span></div>
        <p className="sr-only" aria-live="polite">{character.name}, {court.name}</p>
      </div>
      <style jsx>{`
        .court-enter { animation: court-reveal .55s cubic-bezier(.2,.75,.25,1) both; }
        @keyframes court-reveal { from { opacity: .2; transform: translateY(12px) scale(1.025); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .court-enter { animation: none; } }
      `}</style>
    </section>
  );
}
