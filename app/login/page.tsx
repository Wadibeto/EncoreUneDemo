import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/app/login/auth-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center"><Logo /><h1 className="mt-8 text-3xl font-black">Retrouvez votre duo</h1><p className="mt-2 text-sm text-slate-400">Vos classements et parties vous attendent.</p></div>
        <Card className="p-6 sm:p-8"><Suspense><AuthForm /></Suspense></Card>
        <p className="mt-6 text-center text-sm text-slate-500"><Link href="/" className="hover:text-white">← Retour à l’accueil</Link></p>
      </div>
    </main>
  );
}
