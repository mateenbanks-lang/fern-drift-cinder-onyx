import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { authClient, authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: LoginPage });

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  if (!authEnabled) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg px-4 text-fg">
        <p className="safe-top text-sm text-muted">Sign-in is turned off.</p>
      </main>
    );
  }
  if (isPending) {
    return <main className="min-h-dvh bg-bg" />;
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const mail = email.trim();
    if (!mail.includes("@") || password.length < 8) {
      setError(password.length < 8 ? "Use at least 8 characters." : "Enter a valid email.");
      return;
    }
    setBusy("email");
    try {
      const result =
        mode === "up"
          ? await authClient.signUp.email({
              email: mail,
              password,
              name: mail.split("@")[0] || "mash",
              callbackURL: "/",
            })
          : await authClient.signIn.email({
              email: mail,
              password,
              callbackURL: "/",
            });
      if (result.error) {
        setError(result.error.message || (mode === "up" ? "Couldn’t create that account." : "Couldn’t sign in."));
        setBusy(null);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Couldn’t reach sign-in. Try again.");
      setBusy(null);
    }
  }

  const title = mode === "up" ? "Sign up to mash" : "Sign in to mash";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg px-4 text-fg">
      <div className="safe-top">
        <Link to="/" className="inline-flex py-2 text-base text-muted">
          Back
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className={
            mode === "in"
              ? "rounded-full bg-inverse py-3.5 text-base font-medium text-inverse-fg"
              : "rounded-full border border-line py-3.5 text-base font-medium"
          }
          onClick={() => {
            setMode("in");
            setError(null);
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={
            mode === "up"
              ? "rounded-full bg-inverse py-3.5 text-base font-medium text-inverse-fg"
              : "rounded-full border border-line py-3.5 text-base font-medium"
          }
          onClick={() => {
            setMode("up");
            setError(null);
          }}
        >
          Sign up
        </button>
      </div>
      <h1 className="mt-10 text-center text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 space-y-3">
        {GROK_PROVIDERS.map((p) => (
          <button
            key={p.providerId}
            type="button"
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-line py-4 text-base font-medium disabled:opacity-60"
            onClick={() => {
              setError(null);
              setBusy(p.providerId);
              void signIn(p.providerId, { callbackURL: "/" }).catch((err: unknown) => {
                setError(err instanceof Error ? err.message : "Couldn’t sign in.");
                setBusy(null);
              });
            }}
          >
            {p.idp === "google" ? <GoogleMark /> : <XMark />}
            Continue with {p.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-muted">or use email</p>
      <form className="mt-4" onSubmit={(e) => void onEmail(e)}>
        <label className="block text-base font-medium" htmlFor="mash-email">
          Email
        </label>
        <input
          id="mash-email"
          type="email"
          autoComplete="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-line bg-composer px-4 py-4 text-base outline-none placeholder:text-muted"
        />
        <label className="mt-4 block text-base font-medium" htmlFor="mash-password">
          Password
        </label>
        <input
          id="mash-password"
          type="password"
          autoComplete={mode === "up" ? "new-password" : "current-password"}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-line bg-composer px-4 py-4 text-base outline-none placeholder:text-muted"
        />
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={busy !== null}
          className="mt-4 mb-8 w-full rounded-full bg-inverse py-4 text-base font-semibold text-inverse-fg disabled:opacity-60"
        >
          {busy === "email" ? "Please wait…" : mode === "up" ? "Sign up" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
