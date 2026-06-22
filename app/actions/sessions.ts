"use server";

import { randomInt } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const titleSchema = z.string().trim().min(2, "Le titre doit contenir au moins 2 caractères.").max(80);
const codeSchema = z.string().trim().toUpperCase().regex(/^[TG]-[A-Z2-9]{8}$/, "Code d’invitation invalide.");
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function inviteCode(prefix: "T" | "G") {
  return `${prefix}-${Array.from({ length: 8 }, () => alphabet[randomInt(alphabet.length)]).join("")}`;
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createTierListAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = titleSchema.safeParse(formData.get("title"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { supabase, user } = await authenticatedClient();
  if (!user) return { error: "Votre session a expiré." };

  const { data, error } = await supabase.rpc("create_tier_list", {
    p_title: parsed.data,
    p_invite_code: inviteCode("T"),
  });
  if (error || !data) return { error: error?.message ?? "Création impossible." };
  redirect(`/tierlists/${data}`);
}

export async function createGuessSessionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = titleSchema.safeParse(formData.get("title"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { supabase, user } = await authenticatedClient();
  if (!user) return { error: "Votre session a expiré." };

  const { data, error } = await supabase.rpc("create_guess_session", {
    p_title: parsed.data,
    p_invite_code: inviteCode("G"),
  });
  if (error || !data) return { error: error?.message ?? "Création impossible." };
  redirect(`/guess/${data}`);
}

export async function joinSessionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = codeSchema.safeParse(formData.get("code"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { supabase, user } = await authenticatedClient();
  if (!user) redirect(`/login?next=/join/${parsed.data}`);

  const tier = parsed.data.startsWith("T-");
  const { data, error } = await supabase.rpc(tier ? "join_tier_list" : "join_guess_session", {
    p_invite_code: parsed.data,
  });
  if (error || !data) {
    const full = error?.message.toLowerCase().includes("full");
    return { error: full ? "Cette session contient déjà deux joueurs." : "Session introuvable ou inaccessible." };
  }
  redirect(tier ? `/tierlists/${data}` : `/guess/${data}`);
}
