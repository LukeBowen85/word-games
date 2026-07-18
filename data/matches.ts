export type GameType =
  | "Word Hunt"
  | "Anagrams"
  | "Word Bites";

export type PlayerName = "Luke" | "Maggie";

export type Match = {
  id: string;
  date: string;
  createdAt: string;
  game: GameType;
  lukePoints: number;
  lukeWords: number;
  maggiePoints: number;
  maggieWords: number;
  winner: PlayerName;
};