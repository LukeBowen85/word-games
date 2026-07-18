type PlayerCardProps = {
  name: string;
  wins: number;
  winRate: number;
  averageScore: number;
  streak: string;
  accent: "blue" | "red";
  isLeader?: boolean;
};

const accentStyles = {
  blue: {
    border: "border-[var(--blue)]/35",
    background: "bg-[var(--blue)]",
    text: "text-[var(--blue)]",
  },
  red: {
    border: "border-[var(--red)]/35",
    background: "bg-[var(--red)]",
    text: "text-[var(--red)]",
  },
};

export default function PlayerCard({
  name,
  wins,
  winRate,
  averageScore,
  streak,
  accent,
  isLeader = false,
}: PlayerCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={`relative min-w-0 flex-1 overflow-hidden rounded-[1.75rem] border bg-[var(--card)] px-5 pb-5 pt-6 ${styles.border}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 ${styles.background}`}
      />

      <div className="flex min-h-8 items-start justify-between gap-2">
        <p className="truncate pt-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          {name}
        </p>

        {isLeader && (
          <span
            className="shrink-0 text-xl leading-none"
            aria-label="Current rivalry leader"
            title="Current rivalry leader"
          >
            👑
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-5xl font-black leading-[0.9] tracking-[-0.06em]">
          {wins}
        </p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Wins
        </p>
      </div>

      <div className="mt-7">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className={`h-full rounded-full ${styles.background}`}
            style={{ width: `${winRate}%` }}
          />
        </div>

        <p className={`mt-3 text-sm font-bold ${styles.text}`}>
          {winRate.toFixed(1)}%
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-white/8 pt-5">
        <div className="min-w-0">
          <dt className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            Avg. score
          </dt>

          <dd className="mt-2 text-xl font-bold leading-none">
            {averageScore}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            Streak
          </dt>

          <dd className="mt-2 text-xl font-bold leading-none">
            {streak}
          </dd>
        </div>
      </dl>
    </article>
  );
}