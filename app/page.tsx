"use client";
import Link from "next/link";
import RecentBattles from "@/components/RecentBattles";
import PageContainer from "@/components/PageContainer";
import { useMatches } from "@/components/MatchProvider";
import type { Match, PlayerName } from "@/data/matches";
import PageTransition from "@/components/PageTransition";


export default function HomePage() {
  const { matches, isLoaded } = useMatches();

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (matches.length === 0) {
    return <EmptyHome />;
  }

  const rivalry = calculateHomeStats(matches);
  const { luke, maggie } = rivalry.players;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <PageContainer>
        <PageTransition>
        <header className="text-center">

          <h1 className="mt-6 text-4xl font-black uppercase leading-none tracking-[-0.055em]">
            Word Games
          </h1>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
            Luke × Maggie
          </p>
        </header>

        <p className="mt-10 text-center text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
          {rivalry.totalGames} total games
        </p>
        <section className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[var(--card)]">

          <div className="grid grid-cols-[1fr_auto_1fr] items-end px-5 py-8">
            <PlayerScore
              name={luke.name}
              wins={luke.wins}
              accent="blue"
            />

            <div className="px-4 pb-3 text-xl font-bold text-[var(--muted)]">
              —
            </div>

            <PlayerScore
              name={maggie.name}
              wins={maggie.wins}
              accent="red"
            />
          </div>

          <div className="border-t border-white/8 px-5 py-5">
            <div className="mb-3 flex items-center justify-between text-xs font-bold">
              <span className="text-[var(--blue)]">
                {luke.winRate.toFixed(1)}%
              </span>

              <span className="text-[var(--red)]">
                {maggie.winRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full bg-[var(--blue)]"
                style={{ width: `${luke.winRate}%` }}
              />

              <div
                className="h-full bg-[var(--red)]"
                style={{ width: `${maggie.winRate}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3">
          <StatComparison
            label="Average score"
            lukeValue={luke.averageScore}
            maggieValue={maggie.averageScore}
          />

          <StatComparison
            label="Current streak"
            lukeValue={luke.streak}
            maggieValue={maggie.streak}
          />
        </section>

        <RecentBattles matches={matches} />
      </PageTransition>
      </PageContainer>
    </main>
  );
}

type PlayerScoreProps = {
  name: string;
  wins: number;
  accent: "blue" | "red";
  align?: "left" | "right";
};

function PlayerScore({
  name,
  wins,
  accent,
  align = "left",
}: PlayerScoreProps) {
  const textColor =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  const alignment = "items-center text-center";

  return (
    <div className={`flex min-w-0 flex-col ${alignment}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
        {name}
      </p>

      <p className={`mt-3 text-6xl font-black leading-none tracking-[-0.07em] ${textColor}`}>
        {wins}
      </p>

      <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        Wins
      </p>
    </div>
  );
}

type StatComparisonProps = {
  label: string;
  lukeValue: string | number;
  maggieValue: string | number;
};

function StatComparison({
  label,
  lukeValue,
  maggieValue,
}: StatComparisonProps) {
  return (
    <article className="rounded-xl border border-white/8 bg-[var(--card)] px-5 py-5 text-center">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-5">
        <div className="flex flex-col items-center">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--blue)]">
            Luke
          </p>

          <p className="mt-1 text-2xl font-black">
            {lukeValue}
          </p>
        </div>

        <div className="flex flex-col items-center border-l border-white/8 pl-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--red)]">
            Maggie
          </p>

          <p className="mt-1 text-2xl font-black">
            {maggieValue}
          </p>
        </div>
      </div>
    </article>
  );
}

function calculateHomeStats(matches: Match[]) {
  const lukeWins = matches.filter(
    (match) => match.winner === "Luke",
  ).length;

  const maggieWins = matches.filter(
    (match) => match.winner === "Maggie",
  ).length;

  const lukeTotalPoints = matches.reduce(
    (total, match) => total + match.lukePoints,
    0,
  );

  const maggieTotalPoints = matches.reduce(
    (total, match) => total + match.maggiePoints,
    0,
  );

  const totalGames = matches.length;

  return {
    totalGames,
    players: {
      luke: {
        name: "Luke",
        wins: lukeWins,
        winRate: (lukeWins / totalGames) * 100,
        averageScore: Math.round(
          lukeTotalPoints / totalGames,
        ),
        streak: getPlayerStreak(matches, "Luke"),
      },
      maggie: {
        name: "Maggie",
        wins: maggieWins,
        winRate: (maggieWins / totalGames) * 100,
        averageScore: Math.round(
          maggieTotalPoints / totalGames,
        ),
        streak: getPlayerStreak(matches, "Maggie"),
      },
    },
  };
}

function getPlayerStreak(
  matches: Match[],
  player: PlayerName,
) {
  if (matches.length === 0) return "—";

  const latestWinner = matches[0].winner;
  let count = 0;

  for (const match of matches) {
    if (match.winner !== latestWinner) break;
    count += 1;
  }

  if (latestWinner === player) {
    return `W${count}`;
  }

  return `L${count}`;
}

function LoadingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <PageContainer>
        <PageTransition>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Loading rivalry…
          </p>
        </div>
        </PageTransition>
      </PageContainer>
    </main>
  );
}

function EmptyHome() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <PageContainer>
        <PageTransition>
        <header className="text-center">

          <h1 className="mt-6 text-[clamp(2.25rem,10vw,3.25rem)] font-black uppercase leading-none tracking-[-0.055em]">
            Word Games
          </h1>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
            Luke × Maggie
          </p>
        </header>

        <section className="mt-12 rounded-xl border border-white/10 bg-[var(--card)] px-7 py-10 text-center">

          <h2 className="mt-5 text-2xl font-black">
            The score is 0–0
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            Record your first match to begin the rivalry.
          </p>

          <Link
            href="/record"
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[var(--gold)] px-5 font-black text-[#0b0e13] transition-transform active:scale-[0.98]"
          >
            Record First Match
          </Link>
        </section>
        </PageTransition>
      </PageContainer>
    </main>
  );
}