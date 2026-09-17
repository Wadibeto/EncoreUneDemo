import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/app/login/auth-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen">
      <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between border-b border-border px-5 py-6 sm:px-10"><Logo /><Link href="/" className="focus-ring flex items-center gap-2 text-xs text-[#ae9c87] hover:text-primary"><ArrowLeft className="size-3.5" />Retour</Link></header>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-10 lg:min-h-[78vh] lg:grid-cols-2 lg:gap-20">
        <div className="group relative hidden border border-[#7b5340] p-2 lg:block">
          <div className="relative h-[600px] overflow-hidden bg-[#1f1f1f]"><Image src="/characters/crown-gambit/3lrt6axf63k2g-0.webp" alt="Aliza — Crown Gambit, illustration de Gobert" width={800} height={1000} sizes="480px" priority className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent" /><div className="absolute bottom-6 left-6"><p className="text-[9px] uppercase tracking-[.2em] text-[#c29978]">Crown Gambit</p><p className="display-font mt-1 text-5xl text-[#eee0c5]">Aliza</p></div></div>
          <p className="absolute -bottom-6 right-0 text-[8px] uppercase tracking-widest text-[#8d8171]">Illustration © Gobert · WILD WITS</p>
        </div>
        <section className="mx-auto w-full max-w-md border border-border bg-card p-6 sm:p-9">
          <p className="text-[9px] uppercase tracking-[.25em] text-primary">DuoTier</p><h1 className="display-font mt-3 text-5xl">À votre place.</h1><p className="mb-8 mt-3 text-sm text-[#ae9c87]">Retrouvez vos classements.</p>
          <Suspense fallback={<p className="py-8 text-sm text-[#ae9c87]">Chargement…</p>}><AuthForm /></Suspense>
        </section>
      </div>
    </main>
  );
}
