"use client";

import type { Session } from "@supabase/supabase-js";
import type {
  FormEvent,
  ReactNode,
} from "react";
import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type AuthGateProps = {
  children: ReactNode;
};

export default function AuthGate({
  children,
}: AuthGateProps) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          console.error(
            "Unable to restore session:",
            error,
          );
        }

        setSession(data.session);
        setIsCheckingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsCheckingSession(false);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isCheckingSession) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return children;
}

function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-6 text-[var(--text)]">
      <div className="text-center">
        <div
          className="animate-pulse text-5xl"
          aria-hidden="true"
        >
          🏆
        </div>

        <h1 className="mt-6 text-4xl font-black uppercase tracking-[-0.055em]">
          The Rivalry
        </h1>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)]">
          Loading season…
        </p>
      </div>
    </main>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setErrorMessage(
        "That email or password was not accepted.",
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-6 py-10 text-[var(--text)]">
      <div className="w-full max-w-sm">
        <header className="text-center">
          <div
            className="text-5xl"
            aria-hidden="true"
          >
            🏆
          </div>

          <h1 className="mt-6 text-4xl font-black uppercase tracking-[-0.055em]">
            The Rivalry
          </h1>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
            Luke × Maggie
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-white/10 bg-[var(--card)] p-6"
        >
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
              Email
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="mt-2 min-h-14 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-base outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
              Password
            </span>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-2 min-h-14 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-base outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          {errorMessage && (
            <p
              role="alert"
              className="mt-4 text-sm font-semibold text-[var(--player-two)]"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 min-h-14 w-full rounded-xl bg-[var(--gold)] px-5 font-black text-[#0b0e13] transition active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting
              ? "Signing In…"
              : "Enter The Rivalry"}
          </button>
        </form>
      </div>
    </main>
  );
}