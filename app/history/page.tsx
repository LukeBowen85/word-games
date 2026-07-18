"use client";
import PageContainer from "@/components/PageContainer";
import { useMatches } from "@/components/MatchProvider";
import type { Match } from "@/data/matches";
import { Trash2, Trophy } from "lucide-react";
import { match } from "assert";
import PageTransition from "@/components/PageTransition";
import {
  StaggeredItem,
  StaggeredList,
} from "@/components/StaggeredList";

export default function HistoryPage() {
  const {
    matches,
    isLoaded,
    deleteMatch,
  } = useMatches();

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <PageContainer>
          <PageTransition>
          <p className="mt-20 text-sm font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Loading history…
          </p>
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
              The archive
            </p>

            <h1 className="mt-3 text-[clamp(2.25rem,10vw,3.25rem)] font-black tracking-[-0.055em]">
              Match History
            </h1>
          </header>

          <section className="mt-10 rounded-xl border border-white/10 bg-[var(--card)] px-7 py-10 text-center">
            <div className="text-4xl">📖</div>

            <h2 className="mt-5 text-2xl font-black">
              No battles yet
            </h2>

            <p className="mt-3 text-sm text-[var(--muted)]">
              Recorded matches will appear here.
            </p>
          </section>
          </PageTransition>
        </PageContainer>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <PageContainer>
        <PageTransition>
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
            The archive
          </p>

          <h1 className="mt-3 text-[clamp(2.25rem,10vw,3.25rem)] font-black tracking-[-0.055em]">
            Match History
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            Every game in the Luke and Maggie rivalry.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/10 bg-[var(--card)] px-4 py-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {matches.length} recorded games
            </p>
          </div>
        </header>

        <StaggeredList className="mt-10 space-y-5">
          {matches.map((match, index) => (
            <StaggeredItem key={match.id}>
              <HistoryCard
                match={match}
                matchNumber={matches.length - index}
                onDelete={() => {
                  const confirmed = window.confirm(
                    `Delete this ${match.game} match?`,
                  );

                  if (confirmed) {
                    deleteMatch(match.id);
                  }
                }}
              />
            </StaggeredItem>
          ))}
        </StaggeredList>
        </PageTransition>
      </PageContainer>
    </main>
  );
}

type HistoryCardProps = {
  match: Match;
  matchNumber: number;
  onDelete: () => void;
};

function HistoryCard({
  match,
  matchNumber,
  onDelete,
}: HistoryCardProps) {
  const lukeWon = match.winner === "Luke";
  const maggieWon = match.winner === "Maggie";

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-[var(--card)]">
      <div className="border-b border-white/8 px-6 py-5 text-center">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Battle #{matchNumber}
        </p>

        <h2 className="mt-2 text-xl font-black">
          {match.game}
        </h2>

        <p className="mt-1 text-sm text-[var(--muted)]">
          {match.date}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--gold)]/10 px-4 py-2 text-[var(--gold)]">
          <Trophy size={14} strokeWidth={2.7} />

          <span className="text-xs font-black uppercase tracking-[0.15em]">
            {match.winner} wins
          </span>

          <button
            type="button"
            onClick={onDelete}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--red)]/25 px-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--red)] transition-colors active:bg-[var(--red)]/10"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-6 text-center">
        <HistoryPlayer
          name="Luke"
          points={match.lukePoints}
          words={match.lukeWords}
          winner={lukeWon}
          accent="blue"
        />

        <div className="flex flex-col items-center">
          <span className="text-[0.6rem] font-black uppercase tracking-[0.15em] text-[var(--muted)]">
            Final
          </span>

          <span className="mt-2 text-xl font-bold text-white/30">
            —
          </span>
        </div>

        <HistoryPlayer
          name="Maggie"
          points={match.maggiePoints}
          words={match.maggieWords}
          winner={maggieWon}
          accent="red"
        />
      </div>

      <div className="grid grid-cols-2 border-t border-white/8 text-center">
        <div className="px-4 py-4">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Point margin
          </p>

          <p className="mt-2 text-lg font-black">
            {Math.abs(match.lukePoints - match.maggiePoints)}
          </p>
        </div>

        <div className="border-l border-white/8 px-4 py-4">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Total words
          </p>

          <p className="mt-2 text-lg font-black">
            {match.lukeWords + match.maggieWords}
          </p>
        </div>
      </div>
    </article>
  );
}

type HistoryPlayerProps = {
  name: "Luke" | "Maggie";
  points: number;
  words: number;
  winner: boolean;
  accent: "blue" | "red";
};

function HistoryPlayer({
  name,
  points,
  words,
  winner,
  accent,
}: HistoryPlayerProps) {
  const accentText =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  return (
    <div className="flex min-w-0 flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        <p className={`text-xs font-black uppercase tracking-[0.16em] ${accentText}`}>
          {name}
        </p>

        {winner && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
            aria-label="Winner"
          />
        )}
      </div>

      <p className="mt-3 text-[clamp(2.25rem,11vw,3.25rem)] font-black leading-none tracking-[-0.06em]">
        {points}
      </p>

      <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
        {words} words
      </p>
    </div>
  );
}