"use client";

import PageContainer from "@/components/PageContainer";
import { useMatches } from "@/components/MatchProvider";
import PageTransition from "@/components/PageTransition";
import {
  type GameType,
  type Match,
  type PlayerName,
} from "@/data/matches";

const games: GameType[] = [
  "Word Hunt",
  "Anagrams",
  "Word Bites",
];

export default function StatsPage() {
    const { matches, isLoaded } = useMatches();

    if (!isLoaded) {
      return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
          <PageContainer>
            <PageTransition>
            <div className="flex min-h-[60vh] items-center justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Loading statistics…
              </p>
            </div>
            </PageTransition>
          </PageContainer>
        </main>
      );
    }

    if (matches.length === 0) {
      return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
          <PageContainer>
            <PageTransition>
            <header className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
                League analytics
              </p>

              <h1 className="mt-3 text-[clamp(2.25rem,10vw,3.25rem)] font-black tracking-[-0.055em]">
                Full Stats
              </h1>
            </header>

            <section className="mt-10 rounded-xl border border-white/10 bg-[var(--card)] px-7 py-10 text-center">
              <div className="text-4xl" aria-hidden="true">
                📊
              </div>

              <h2 className="mt-5 text-2xl font-black">
                Nothing to calculate yet
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Stats and records will unlock after your first match.
              </p>
            </section>
            </PageTransition>
          </PageContainer>
        </main>
      );
    }

    const stats = calculateStats(matches);

    return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <PageContainer>
        <PageTransition>
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
            League analytics
          </p>

          <h1 className="mt-3 text-[clamp(2.25rem,10vw,3.25rem)] font-black tracking-[-0.055em]">
            Full Stats
          </h1>

        </header>

        <section className="mt-10">
          <SectionHeading
            eyebrow="All-time"
            title="Overall Performance"
          />

          <div className="mt-5 grid grid-cols-2 gap-4">
            <PlayerOverview
              name="Luke"
              wins={stats.luke.wins}
              winRate={stats.luke.winRate}
              averagePoints={stats.luke.averagePoints}
              averageWords={stats.luke.averageWords}
              totalPoints={stats.luke.totalPoints}
              accent="blue"
            />

            <PlayerOverview
              name="Maggie"
              wins={stats.maggie.wins}
              winRate={stats.maggie.winRate}
              averagePoints={stats.maggie.averagePoints}
              averageWords={stats.maggie.averageWords}
              totalPoints={stats.maggie.totalPoints}
              accent="red"
            />
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading
            eyebrow="Head to head"
            title="Records by Game"
          />

          <div className="mt-5 space-y-4">
            {games.map((game) => (
              <GameStatsCard
                key={game}
                game={game}
                matches={matches.filter(
                  (match) => match.game === game,
                )}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading
            eyebrow="All time"
            title="Records"
          />

          <div className="mt-5 grid grid-cols-2 gap-4">
            <RecordCard
              label="Highest score"
              value={stats.records.highestScore.value}
              detail={`${stats.records.highestScore.player} · ${stats.records.highestScore.game}`}
            />

            <RecordCard
              label="Most words"
              value={stats.records.mostWords.value}
              detail={`${stats.records.mostWords.player} · ${stats.records.mostWords.game}`}
            />

            <RecordCard
              label="Closest game"
              value={stats.records.closestGame.margin}
              suffix="pts"
              detail={stats.records.closestGame.game}
            />

            <RecordCard
              label="Biggest win"
              value={stats.records.biggestWin.margin}
              suffix="pts"
              detail={`${stats.records.biggestWin.winner} · ${stats.records.biggestWin.game}`}
            />
          </div>
        </section>
        </PageTransition>
      </PageContainer>
    </main>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
};

function SectionHeading({
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div className="text-center">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight">
        {title}
      </h2>
    </div>
  );
}

type PlayerOverviewProps = {
  name: PlayerName;
  wins: number;
  winRate: number;
  averagePoints: number;
  averageWords: number;
  totalPoints: number;
  accent: "blue" | "red";
};

function PlayerOverview({
  name,
  wins,
  winRate,
  averagePoints,
  averageWords,
  totalPoints,
  accent,
}: PlayerOverviewProps) {
  const accentText =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  const accentBackground =
    accent === "blue"
      ? "bg-[var(--blue)]"
      : "bg-[var(--red)]";

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-[var(--card)]">
      <div className={`h-1.5 w-full ${accentBackground}`} />

      <div className="px-5 py-6 text-center">
        <p
          className={`text-xs font-black uppercase tracking-[0.18em] ${accentText}`}
        >
          {name}
        </p>

        <p className="mt-4 text-[clamp(2.5rem,12vw,3.5rem)] font-black leading-none tracking-[-0.06em]">
          {wins}
        </p>

        <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
          Wins
        </p>

        <p className={`mt-5 text-2xl font-black ${accentText}`}>
          {winRate.toFixed(1)}%
        </p>

        <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          Win Rate
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className={`h-full rounded-full ${accentBackground}`}
            style={{ width: `${winRate}%` }}
          />
        </div>

        <div className="mt-5 border-t border-white/8 pt-5">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Total points
          </p>

          <p className="mt-2 text-2xl font-black">
            {totalPoints.toLocaleString()}
          </p>
        </div>

        <div className="mt-6 space-y-4 border-t border-white/8 pt-5">
          <MiniStat
            label="Avg. points"
            value={averagePoints}
          />

          <MiniStat
            label="Avg. words"
            value={averageWords}
          />
        </div>
      </div>
    </article>
  );
}

type MiniStatProps = {
  label: string;
  value: number;
};

function MiniStat({
  label,
  value,
}: MiniStatProps) {
  return (
    <div className="text-center">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>

      <p className="mt-2 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

type GameStatsCardProps = {
  game: GameType;
  matches: Match[];
};

function GameStatsCard({
  game,
  matches,
}: GameStatsCardProps) {
  const lukeWins = matches.filter(
    (match) => match.winner === "Luke",
  ).length;

  const maggieWins = matches.filter(
    (match) => match.winner === "Maggie",
  ).length;

  const total = matches.length;

  return (
    <article className="rounded-xl border border-white/10 bg-[var(--card)] px-6 py-6 text-center">
      <p className="text-xl font-black">
        {game}
      </p>

      <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
        {total} {total === 1 ? "game" : "games"} played
      </p>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <GamePlayer
          name="Luke"
          wins={lukeWins}
          accent="blue"
        />

        <span className="text-xl font-bold text-white/25">
          —
        </span>

        <GamePlayer
          name="Maggie"
          wins={maggieWins}
          accent="red"
        />
      </div>

      {total > 0 && (
        <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full bg-[var(--blue)]"
            style={{
              width: `${(lukeWins / total) * 100}%`,
            }}
          />

          <div
            className="h-full bg-[var(--red)]"
            style={{
              width: `${(maggieWins / total) * 100}%`,
            }}
          />
        </div>
      )}
    </article>
  );
}

type GamePlayerProps = {
  name: PlayerName;
  wins: number;
  accent: "blue" | "red";
};

function GamePlayer({
  name,
  wins,
  accent,
}: GamePlayerProps) {
  const accentText =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  return (
    <div className="flex flex-col items-center text-center">
      <p
        className={`text-xs font-black uppercase tracking-[0.16em] ${accentText}`}
      >
        {name}
      </p>

      <p className="mt-2 text-4xl font-black">
        {wins}
      </p>

      <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
        Wins
      </p>
    </div>
  );
}

type RecordCardProps = {
  label: string;
  value: number;
  detail: string;
  suffix?: string;
};

function RecordCard({
  label,
  value,
  detail,
  suffix,
}: RecordCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-[var(--card)] px-5 py-6 text-center">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
        {label}
      </p>

      <p className="mt-4 text-3xl font-black">
        {value}
        {suffix && (
          <span className="ml-1 text-sm text-[var(--muted)]">
            {suffix}
          </span>
        )}
      </p>

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {detail}
      </p>
    </article>
  );
}

function calculateStats(matches: Match[]) {
  function getPlayerStats(player: PlayerName) {
    const wins = matches.filter(
      (match) => match.winner === player,
    ).length;

    const totalPoints = matches.reduce(
      (sum, match) =>
        sum +
        (player === "Luke"
          ? match.lukePoints
          : match.maggiePoints),
      0,
    );

    const totalWords = matches.reduce(
      (sum, match) =>
        sum +
        (player === "Luke"
          ? match.lukeWords
          : match.maggieWords),
      0,
    );

    return {
      wins,
      winRate:
        matches.length > 0
          ? (wins / matches.length) * 100
          : 0,
      averagePoints:
        matches.length > 0
          ? Math.round(totalPoints / matches.length)
          : 0,
      averageWords:
        matches.length > 0
          ? Math.round(totalWords / matches.length)
          : 0,
      totalPoints,
    };
  }

  const performances = matches.flatMap((match) => [
    {
      player: "Luke" as const,
      game: match.game,
      points: match.lukePoints,
      words: match.lukeWords,
    },
    {
      player: "Maggie" as const,
      game: match.game,
      points: match.maggiePoints,
      words: match.maggieWords,
    },
  ]);

  const highestScore = performances.reduce(
    (best, current) =>
      current.points > best.points ? current : best,
  );

  const mostWords = performances.reduce(
    (best, current) =>
      current.words > best.words ? current : best,
  );

  const margins = matches.map((match) => ({
    game: match.game,
    winner: match.winner,
    margin: Math.abs(
      match.lukePoints - match.maggiePoints,
    ),
  }));

  const closestGame = margins.reduce(
    (best, current) =>
      current.margin < best.margin ? current : best,
  );

  const biggestWin = margins.reduce(
    (best, current) =>
      current.margin > best.margin ? current : best,
  );

  return {
    luke: getPlayerStats("Luke"),
    maggie: getPlayerStats("Maggie"),
    records: {
      highestScore: {
        player: highestScore.player,
        game: highestScore.game,
        value: highestScore.points,
      },
      mostWords: {
        player: mostWords.player,
        game: mostWords.game,
        value: mostWords.words,
      },
      closestGame,
      biggestWin,
    },
  };
}