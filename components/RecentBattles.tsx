import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import type { Match } from "@/data/matches";

type RecentBattlesProps = {
  matches: Match[];
};

export default function RecentBattles({
  matches,
}: RecentBattlesProps) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            Recent form
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight">
            Recent Battles
          </h2>
        </div>

        <Link
          href="/history"
          className="flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--muted)] transition-colors active:text-white"
        >
          View all
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {matches.slice(0, 3).map((match) => (
          <BattleCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

type BattleCardProps = {
  match: Match;
};

function BattleCard({ match }: BattleCardProps) {
  const lukeWon = match.winner === "Luke";
  const maggieWon = match.winner === "Maggie";

  return (
    <article className="overflow-hidden rounded-xl border border-white/8 bg-[var(--card)]">
      <div className="flex flex-col items-center justify-center border-b border-white/8 px-5 py-5 text-center">
        <div>
          <p className="text-sm font-black">
            {match.game}
          </p>

          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {match.date}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-[var(--gold)]/10 px-3 py-1.5 text-[var(--gold)]">
          <Trophy size={13} strokeWidth={2.6} />

          <span className="text-[0.65rem] font-black uppercase tracking-[0.12em]">
            {match.winner}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-5">
        <PlayerResult
          name="Luke"
          points={match.lukePoints}
          words={match.lukeWords}
          winner={lukeWon}
          accent="blue"
        />

        <div className="px-3 text-sm font-bold text-[var(--muted)]">
          FINAL
        </div>

        <PlayerResult
          name="Maggie"
          points={match.maggiePoints}
          words={match.maggieWords}
          winner={maggieWon}
          accent="red"
          align="right"
        />
      </div>
    </article>
  );
}

type PlayerResultProps = {
  name: string;
  points: number;
  words: number;
  winner: boolean;
  accent: "blue" | "red";
  align?: "left" | "right";
};

function PlayerResult({
  name,
  points,
  words,
  winner,
  accent,
  align = "left",
}: PlayerResultProps) {
  const accentColor =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  const alignment =
    align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <div className={`flex min-w-0 flex-col ${alignment}`}>
      <div className="flex items-center gap-1.5">
        <p className={`text-xs font-black uppercase tracking-[0.16em] ${accentColor}`}>
          {name}
        </p>

        {winner && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
            aria-label="Winner"
          />
        )}
      </div>

      <p className="mt-2 text-3xl font-black leading-none tracking-[-0.04em]">
        {points}
      </p>

      <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        {words} words
      </p>
    </div>
  );
}