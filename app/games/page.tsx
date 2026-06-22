import { Library } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GameManager } from "@/app/games/game-manager";
import { createClient } from "@/lib/supabase/server";
import type { Game, Profile } from "@/lib/types";
import { redirect } from "next/navigation";

export const metadata = { title: "Catalogue de jeux" };

export default async function GamesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: games }, { data: profile }] = await Promise.all([
    supabase.from("games").select("*").order("title"),
    supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
  ]);
  return (
    <AppShell>
      <div className="mb-8"><p className="flex items-center gap-2 text-sm font-semibold text-violet-300"><Library className="size-4" />Catalogue commun</p><h1 className="mt-2 text-3xl font-black">Les jeux du duo</h1><p className="mt-2 text-slate-400">Cette bibliothèque alimente les nouvelles tier lists et parties Qui est-ce.</p>{!(profile as Pick<Profile, "is_admin"> | null)?.is_admin && <p className="mt-3 text-xs text-slate-500">Mode lecture seule. Un administrateur peut modifier le catalogue.</p>}</div>
      <GameManager games={(games ?? []) as Game[]} isAdmin={Boolean((profile as Pick<Profile, "is_admin"> | null)?.is_admin)} />
    </AppShell>
  );
}
