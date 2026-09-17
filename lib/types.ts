export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
};

export type Game = {
  id: string;
  title: string;
  cover_url: string | null;
  release_year: number | null;
  genre: string | null;
  tags: string[];
  description: string | null;
  created_at?: string;
};

/** Stable internal key; labels can be renamed independently. */
export type TierKey = string;
export type TierCategory = "games" | "characters";
export type CatalogFilter = "all" | "crown-gambit" | "sovereign-tower";

export type TierItem = {
  id: string;
  tier_list_id: string;
  game_id: string | null;
  character_id: string | null;
  variant_id: string | null;
  tier: TierKey;
  position: number;
  game: Game | null;
};

export type TierDefinition = {
  key: TierKey;
  label: string;
  color: string;
};

export type GuessPlayer = {
  session_id: string;
  user_id: string;
  player_number: number;
  ready: boolean;
  profile: Profile;
};

export type ActionState = { error?: string; success?: string };
