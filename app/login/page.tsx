import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Layers3 } from "lucide-react";
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
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-7 sm:px-10"><Logo /><Link href="/" className="focus-ring flex items-center gap-2 rounded-sm text-xs text-slate-400 hover:text-primary"><ArrowLeft className="size-3.5" />L’accueil</Link></header>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-10 sm:px-10 lg:min-h-[75vh] lg:grid-cols-2 lg:gap-24">
        <div className="hidden lg:block">
          <p className="eyebrow">Votre duo a rendez-vous ici</p>
          <p className="display-font mt-7 text-7xl leading-[1.05]">Les meilleurs<br />classements<br />se font <em className="text-primary">à deux.</em></p>
          <div className="atelier-rule my-8 max-w-xs" />
          <p className="max-w-sm text-sm leading-7 text-slate-400">Un jeu inoubliable. Une armure incroyable. Une opinion très discutable. Retrouvez votre collection et faites vivre le débat.</p>
          <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-slate-500"><Layers3 className="size-5 text-primary" strokeWidth={1} />Jeux · Personnages · Qui est-ce ?</div>
        </div>
        <section className="panel mx-auto w-full max-w-md p-6 sm:p-9">
          <p className="eyebrow">Entrez dans l’atelier</p><h1 className="display-font mt-3 text-4xl">Retrouvez votre duo.</h1><p className="mb-7 mt-3 text-sm leading-6 text-slate-400">Vos classements et vos parties vous attendent.</p>
          <Suspense fallback={<p className="py-8 text-sm text-slate-400">Chargement…</p>}><AuthForm /></Suspense>
        </section>
      </div>
      <footer className="pb-8 pt-5 text-center text-[10px] uppercase tracking-[.18em] text-slate-500">DuoTier · L’art de ne pas être d’accord</footer>
    </main>
  );
}
