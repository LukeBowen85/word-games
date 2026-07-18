export type GameType =
  | "Word Hunt"
  | "Anagrams"
  | "Word Bites";

export type PlayerName = "Luke" | "Maggie";

export type Match = {
  id: number;
  date: string;
  game: GameType;
  lukePoints: number;
  lukeWords: number;
  maggiePoints: number;
  maggieWords: number;
  winner: PlayerName;
};

export const mockMatches: Match[] = [
  {
    id: 1,
    date: "July 15, 2026",
    game: "Word Hunt",
    lukePoints: 214,
    lukeWords: 41,
    maggiePoints: 226,
    maggieWords: 46,
    winner: "Maggie",
  },
  {
    id: 2,
    date: "July 14, 2026",
    game: "Anagrams",
    lukePoints: 188,
    lukeWords: 36,
    maggiePoints: 179,
    maggieWords: 34,
    winner: "Luke",
  },
  {
    id: 3,
    date: "July 12, 2026",
    game: "Word Bites",
    lukePoints: 241,
    lukeWords: 48,
    maggiePoints: 257,
    maggieWords: 51,
    winner: "Maggie",
  },
  {
    id: 4,
    date: "July 11, 2026",
    game: "Word Hunt",
    lukePoints: 203,
    lukeWords: 39,
    maggiePoints: 216,
    maggieWords: 43,
    winner: "Maggie",
  },
];