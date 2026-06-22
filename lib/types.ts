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

export type TierKey =
  | "unranked"
  | "S"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "unfinished"
  | "demo"
  | "abandoned";

export type TierItem = {
  id: string;
  tier_list_id: string;
  game_id: string;
  tier: TierKey;
  position: number;
  game: Game;
};

export type GuessPlayer = {
  session_id: string;
  user_id: string;
  player_number: number;
  ready: boolean;
  profile: Profile;
};

export type ActionState = { error?: string; success?: string };
