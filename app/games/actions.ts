"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

const gameSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(1).max(120),
  cover_url: z.string().url("URL d’image invalide.").optional().or(z.literal("")),
  release_year: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().int().min(1970).max(2100).optional()),
  genre: z.string().trim().max(80).optional(),
  tags: z.string().max(500).optional(),
  description: z.string().trim().max(500).optional(),
});

export async function saveGameAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = gameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée." };

  const payload = {
    title: parsed.data.title,
    cover_url: parsed.data.cover_url || null,
    release_year: parsed.data.release_year ?? null,
    genre: parsed.data.genre || null,
    tags: (parsed.data.tags || "").split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    description: parsed.data.description || null,
  };
  const query = parsed.data.id
    ? supabase.from("games").update(payload).eq("id", parsed.data.id)
    : supabase.from("games").insert(payload);
  const { error } = await query;
  if (error) return { error: error.code === "42501" ? "Droits administrateur requis." : error.message };
  revalidatePath("/games");
  return { success: "Jeu enregistré." };
}

export async function deleteGameAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return { error: "Jeu invalide." };
  const supabase = await createClient();
  const { error } = await supabase.from("games").delete().eq("id", id.data);
  if (error) return { error: error.code === "23503" ? "Ce jeu est utilisé par une partie et ne peut pas être supprimé." : error.message };
  revalidatePath("/games");
  return { success: "Jeu supprimé." };
}
