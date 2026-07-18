"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Match } from "@/data/matches";
import { supabase } from "@/lib/supabase";

type NewMatch = Omit<
  Match,
  "id" | "date" | "createdAt" | "winner"
>;

type MatchContextValue = {
  matches: Match[];
  isLoaded: boolean;
  error: string | null;
  addMatch: (match: NewMatch) => Promise<Match>;
  deleteMatch: (id: string) => Promise<void>;
  clearMatches: () => Promise<void>;
  refreshMatches: () => Promise<void>;
};

type DatabaseMatch = {
  id: string;
  rivalry_id: string;
  played_at: string;
  created_at: string;
  game: Match["game"];
  luke_points: number;
  luke_words: number;
  maggie_points: number;
  maggie_words: number;
  winner: Match["winner"];
};

const MatchContext =
  createContext<MatchContextValue | null>(null);

type MatchProviderProps = {
  children: ReactNode;
};

function formatDisplayDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function mapDatabaseMatch(
  databaseMatch: DatabaseMatch,
): Match {
  return {
    id: databaseMatch.id,
    date: formatDisplayDate(databaseMatch.played_at),
    createdAt: databaseMatch.created_at,
    game: databaseMatch.game,
    lukePoints: databaseMatch.luke_points,
    lukeWords: databaseMatch.luke_words,
    maggiePoints: databaseMatch.maggie_points,
    maggieWords: databaseMatch.maggie_words,
    winner: databaseMatch.winner,
  };
}

export default function MatchProvider({
  children,
}: MatchProviderProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [rivalryId, setRivalryId] =
    useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const loadRivalryId = useCallback(async () => {
    const {
      data: membership,
      error: membershipError,
    } = await supabase
      .from("rivalry_members")
      .select("rivalry_id")
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    if (!membership) {
      throw new Error(
        "This account is not connected to a rivalry.",
      );
    }

    const loadedRivalryId =
      membership.rivalry_id as string;

    setRivalryId(loadedRivalryId);

    return loadedRivalryId;
  }, []);

  const fetchMatches = useCallback(
    async (knownRivalryId?: string) => {
      try {
        setError(null);

        const activeRivalryId =
          knownRivalryId ??
          rivalryId ??
          (await loadRivalryId());

        const {
          data,
          error: matchesError,
        } = await supabase
          .from("matches")
          .select(
            `
              id,
              rivalry_id,
              played_at,
              created_at,
              game,
              luke_points,
              luke_words,
              maggie_points,
              maggie_words,
              winner
            `,
          )
          .eq("rivalry_id", activeRivalryId)
          .order("created_at", {
            ascending: false,
          });

        if (matchesError) {
          throw matchesError;
        }

        const databaseMatches =
          (data ?? []) as DatabaseMatch[];

        setMatches(
          databaseMatches.map(mapDatabaseMatch),
        );
      } catch (requestError) {
        console.error(
          "Could not load matches from Supabase:",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load matches.",
        );
      } finally {
        setIsLoaded(true);
      }
    },
    [loadRivalryId, rivalryId],
  );

  useEffect(() => {
    void fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (!rivalryId) {
      return;
    }

    const channel = supabase
      .channel(`matches-${rivalryId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `rivalry_id=eq.${rivalryId}`,
        },
        () => {
          void fetchMatches(rivalryId);
        },
      )
      .subscribe((status, subscriptionError) => {
        console.log(
          "Supabase Realtime status:",
          status,
        );

        if (subscriptionError) {
          console.error(
            "Supabase Realtime error:",
            subscriptionError,
          );
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchMatches, rivalryId]);

  const addMatch = useCallback(
    async (match: NewMatch): Promise<Match> => {
      if (!rivalryId) {
        throw new Error(
          "The rivalry has not finished loading.",
        );
      }

      const now = new Date();

      const winner: Match["winner"] =
        match.lukePoints > match.maggiePoints
          ? "Luke"
          : "Maggie";

      const playedAt = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");

      const {
        data,
        error: insertError,
      } = await supabase
        .from("matches")
        .insert({
          rivalry_id: rivalryId,
          played_at: playedAt,
          game: match.game,
          luke_points: match.lukePoints,
          luke_words: match.lukeWords,
          maggie_points: match.maggiePoints,
          maggie_words: match.maggieWords,
          winner,
        })
        .select(
          `
            id,
            rivalry_id,
            played_at,
            created_at,
            game,
            luke_points,
            luke_words,
            maggie_points,
            maggie_words,
            winner
          `,
        )
        .single();

      if (insertError) {
        console.error(
          "Could not save match to Supabase:",
          insertError,
        );

        throw new Error(
          insertError.message ||
            "The match could not be saved.",
        );
      }

      const newMatch = mapDatabaseMatch(
        data as DatabaseMatch,
      );

      setMatches((currentMatches) => [
        newMatch,
        ...currentMatches.filter(
          (currentMatch) =>
            currentMatch.id !== newMatch.id,
        ),
      ]);

      return newMatch;
    },
    [rivalryId],
  );

  const deleteMatch = useCallback(
    async (id: string): Promise<void> => {
      const { error: deleteError } =
        await supabase
          .from("matches")
          .delete()
          .eq("id", id);

      if (deleteError) {
        console.error(
          "Could not delete match from Supabase:",
          deleteError,
        );

        throw new Error(
          deleteError.message ||
            "The match could not be deleted.",
        );
      }

      setMatches((currentMatches) =>
        currentMatches.filter(
          (match) => match.id !== id,
        ),
      );
    },
    [],
  );

  const clearMatches = useCallback(
    async (): Promise<void> => {
      if (!rivalryId) {
        throw new Error(
          "The rivalry has not finished loading.",
        );
      }

      const { error: clearError } =
        await supabase
          .from("matches")
          .delete()
          .eq("rivalry_id", rivalryId);

      if (clearError) {
        console.error(
          "Could not clear matches from Supabase:",
          clearError,
        );

        throw new Error(
          clearError.message ||
            "The matches could not be cleared.",
        );
      }

      setMatches([]);
    },
    [rivalryId],
  );

  const refreshMatches = useCallback(
    async (): Promise<void> => {
      await fetchMatches();
    },
    [fetchMatches],
  );

  const contextValue =
    useMemo<MatchContextValue>(
      () => ({
        matches,
        isLoaded,
        error,
        addMatch,
        deleteMatch,
        clearMatches,
        refreshMatches,
      }),
      [
        matches,
        isLoaded,
        error,
        addMatch,
        deleteMatch,
        clearMatches,
        refreshMatches,
      ],
    );

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatches(): MatchContextValue {
  const context = useContext(MatchContext);

  if (!context) {
    throw new Error(
      "useMatches must be used inside MatchProvider.",
    );
  }

  return context;
}