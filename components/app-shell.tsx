import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile: Profile = data ?? {
    id: user.id,
    username: user.user_metadata.username ?? user.email?.split("@")[0] ?? "Joueur",
    avatar_url: null,
    is_admin: false,
  };

  return (
    <div className="min-h-screen">
      <AppHeader profile={profile} />
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-10 lg:px-12">{children}</main>
      <footer className="mx-auto mt-16 flex max-w-[1440px] flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-6 text-[10px] uppercase tracking-[.15em] text-slate-500 sm:px-8 lg:px-12">
        <span>DuoTier</span><span aria-hidden="true">♜ · ♛ · ♜</span>
      </footer>
    </div>
  );
}
