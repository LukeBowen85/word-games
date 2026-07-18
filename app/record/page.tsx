"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft } from "lucide-react";

import { useMatches } from "@/components/MatchProvider";
import type { GameType } from "@/data/matches";
import PageTransition from "@/components/PageTransition";

const games = ["Word Hunt", "Anagrams", "Word Bites"] as const;

type Game = GameType;

type MatchForm = {
  game: Game | null;
  lukePoints: string;
  lukeWords: string;
  maggiePoints: string;
  maggieWords: string;
};

const initialForm: MatchForm = {
  game: null,
  lukePoints: "",
  lukeWords: "",
  maggiePoints: "",
  maggieWords: "",
};

export default function RecordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<MatchForm>(initialForm);
  const [saved, setSaved] = useState(false);
  const { addMatch } = useMatches();

  const winner = useMemo(() => {
    const luke = Number(form.lukePoints);
    const maggie = Number(form.maggiePoints);

    if (!form.lukePoints || !form.maggiePoints) return null;
    if (luke === maggie) return "Tie";

    return luke > maggie ? "Luke" : "Maggie";
  }, [form.lukePoints, form.maggiePoints]);

  const canContinueFromLuke =
    form.lukePoints.trim() !== "" && form.lukeWords.trim() !== "";

  const canSave =
    form.maggiePoints.trim() !== "" &&
    form.maggieWords.trim() !== "";

  function updateField(
    field: keyof MatchForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave() {
    if (
      !form.game ||
      !canSave ||
      !form.lukePoints ||
      !form.lukeWords
    ) {
      return;
    }

    addMatch({
      game: form.game,
      lukePoints: Number(form.lukePoints),
      lukeWords: Number(form.lukeWords),
      maggiePoints: Number(form.maggiePoints),
      maggieWords: Number(form.maggieWords),
    });

    setSaved(true);
  }

  function resetForm() {
    setForm(initialForm);
    setStep(1);
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="relative z-10 mx-auto w-full max-w-sm px-6 pb-36 pt-10">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
            New battle
          </p>

          <div className="mt-2 flex items-end justify-between">
            <h1 className="text-4xl font-black tracking-[-0.05em]">
              Record Match
            </h1>

            {!saved && (
              <p className="pb-1 text-sm font-bold text-[var(--muted)]">
                {step} / 3
              </p>
            )}
          </div>
        </header>

        <div className="mt-7 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1 flex-1 rounded-full transition-colors ${
                item <= step
                  ? "bg-[var(--gold)]"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <>
          {saved ? (
            <section className="mt-10">
              <div className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--card)] px-6 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-[#0b0e13]">
                  <Check size={30} strokeWidth={3} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Match recorded
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {winner === "Tie"
                    ? "Dead Even"
                    : `${winner} Wins`}
                </h2>

                <p className="mt-2 text-[var(--muted)]">
                  {form.game}
                </p>

                <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center">
                  <ScoreResult
                    name="Luke"
                    score={form.lukePoints}
                    accent="blue"
                  />

                  <div className="px-3 text-xl font-bold text-[var(--muted)]">
                    —
                  </div>

                  <ScoreResult
                    name="Maggie"
                    score={form.maggiePoints}
                    accent="red"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="mt-5 min-h-14 w-full rounded-2xl bg-white text-base font-black text-[#0b0e13] transition-transform active:scale-[0.98]"
              >
                Record Another
              </button>
            </section>
          ) : (
            <div key={step}>
              {step === 1 && (
                <GameStep
                  selectedGame={form.game}
                  onSelect={(game) => {
                    updateField("game", game);
                    setStep(2);
                  }}
                />
              )}

              {step === 2 && (
                <PlayerStep
                  player="Luke"
                  accent="blue"
                  points={form.lukePoints}
                  words={form.lukeWords}
                  onPointsChange={(value) =>
                    updateField("lukePoints", value)
                  }
                  onWordsChange={(value) =>
                    updateField("lukeWords", value)
                  }
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                  canContinue={canContinueFromLuke}
                />
              )}

              {step === 3 && (
                <PlayerStep
                  player="Maggie"
                  accent="red"
                  points={form.maggiePoints}
                  words={form.maggieWords}
                  onPointsChange={(value) =>
                    updateField("maggiePoints", value)
                  }
                  onWordsChange={(value) =>
                    updateField("maggieWords", value)
                  }
                  onBack={() => setStep(2)}
                  onContinue={handleSave}
                  canContinue={canSave}
                  actionLabel="Save Match"
                />
              )}
            </div>
          )}
        </>
      </div>
    </main>
  );
}

type GameStepProps = {
  selectedGame: Game | null;
  onSelect: (game: Game) => void;
};

function GameStep({
  selectedGame,
  onSelect,
}: GameStepProps) {
  return (
    <section className="mt-10">
      <p className="text-sm font-semibold text-[var(--muted)]">
        What did you play?
      </p>

      <div className="mt-5 space-y-3">
        {games.map((game, index) => {
          const selected = selectedGame === game;

          return (
            <button
            key={game}
            type="button"
            onClick={() => onSelect(game)}
            className={`flex min-h-20 w-full touch-manipulation items-center justify-between rounded-2xl border px-5 text-left transition-transform transition-colors active:scale-[0.98] ${
                selected
                ? "border-[var(--gold)] bg-[var(--gold)]/10"
                : "border-white/10 bg-[var(--card)]"
            }`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Game {index + 1}
                </p>

                <p className="mt-1 text-xl font-black">
                  {game}
                </p>
              </div>

              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#0b0e13]"
                    : "border-white/15 text-[var(--muted)]"
                }`}
              >
                {selected ? <Check size={17} strokeWidth={3} /> : index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type PlayerStepProps = {
  player: "Luke" | "Maggie";
  accent: "blue" | "red";
  points: string;
  words: string;
  onPointsChange: (value: string) => void;
  onWordsChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  actionLabel?: string;
};

function PlayerStep({
  player,
  accent,
  points,
  words,
  onPointsChange,
  onWordsChange,
  onBack,
  onContinue,
  canContinue,
  actionLabel = "Continue",
}: PlayerStepProps) {
  const accentText =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  const accentBackground =
    accent === "blue"
      ? "bg-[var(--blue)]"
      : "bg-[var(--red)]";

  return (
    <section className="mt-9">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--muted)]"
      >
        <ChevronLeft size={19} />
        Back
      </button>

      <div className="mt-5">
        <p className={`text-xs font-bold uppercase tracking-[0.22em] ${accentText}`}>
          Player score
        </p>

        <h2 className="mt-2 text-4xl font-black">
          {player}
        </h2>
      </div>

      <div className="mt-8 space-y-4">
        <NumberField
            label="Total points"
            value={points}
            placeholder="0"
            onChange={onPointsChange}
        />

        <NumberField
          label="Words made"
          value={words}
          placeholder="0"
          onChange={onWordsChange}
        />
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className={`mt-7 min-h-14 w-full rounded-2xl text-base font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-[var(--muted)] ${
          canContinue
            ? `${accentBackground} text-white`
            : ""
        }`}
      >
        {actionLabel}
      </button>
    </section>
  );
}

type NumberFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

function NumberField({
  label,
  value,
  placeholder,
  onChange,
  autoFocus = false,
}: NumberFieldProps) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-[var(--card)] px-5 py-4 focus-within:border-white/30">
      <span className="text-xs font-bold uppercase tracking-[0.17em] text-[var(--muted)]">
        {label}
      </span>

      <input
        type="number"
        inputMode="numeric"
        min="0"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent text-4xl font-black outline-none placeholder:text-white/15"
      />
    </label>
  );
}

type ScoreResultProps = {
  name: string;
  score: string;
  accent: "blue" | "red";
};

function ScoreResult({
  name,
  score,
  accent,
}: ScoreResultProps) {
  const accentText =
    accent === "blue"
      ? "text-[var(--blue)]"
      : "text-[var(--red)]";

  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-[0.18em] ${accentText}`}>
        {name}
      </p>

      <p className="mt-2 text-5xl font-black tracking-[-0.06em]">
        {score}
      </p>
    </div>
  );
}