"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthPageProps {
  callbackUrl: string;
  githubEnabled: boolean;
  googleEnabled: boolean;
  magicLinkEnabled: boolean;
}

const features = [
  {
    title: "Magic link access",
    body: "Passwordless sign-in for fast access from any device.",
  },
  {
    title: "Social providers",
    body: "Use GitHub or Google when you want one-click access.",
  },
  {
    title: "Classic credentials",
    body: "Email and password remain available for existing standard accounts.",
  },
];

export function AuthPage({ callbackUrl, githubEnabled, googleEnabled, magicLinkEnabled }: AuthPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [manualForm, setManualForm] = useState({ name: "", email: "", password: "" });
  const [magicLinkEmail, setMagicLinkEmail] = useState("");

  async function handleOAuthSignIn(provider: "google" | "github", enabled: boolean, providerLabel: string) {
    setError("");
    setMessage("");

    if (!enabled) {
      setError(`${providerLabel} sign-in is not configured for this environment.`);
      return;
    }

    const result = await signIn(provider, { callbackUrl, redirect: false });
    if (result?.error) {
      setError(`${providerLabel} sign-in failed.`);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  }

  async function handleMagicLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMagicLinkLoading(true);
    setError("");
    setMessage("");

    if (!magicLinkEnabled) {
      setMagicLinkLoading(false);
      setError("Magic link sign-in is not configured for this environment.");
      return;
    }

    const result = await signIn("resend", {
      email: magicLinkEmail,
      callbackUrl,
      redirect: false,
    });

    setMagicLinkLoading(false);

    if (result?.error) {
      setError("Unable to send the sign-in link right now.");
      return;
    }

    setMessage(`Magic link sent to ${magicLinkEmail}. Open your email and use the sign-in link to continue.`);
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...manualForm, mode: authMode }),
    });

    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setLoading(false);
      setError(body.error ?? "Unable to log in.");
      return;
    }

    const result = await signIn("credentials", {
      email: manualForm.email,
      password: manualForm.password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email or password is incorrect.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(124,58,237,0.14),transparent_22%),radial-gradient(circle_at_74%_76%,rgba(34,197,94,0.08),transparent_24%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1440 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M102 188L294 262L446 174L631 258L842 129L1038 251L1244 170L1360 232" stroke="url(#lineA)" strokeWidth="1.2" />
        <path d="M90 640L238 558L402 634L591 514L786 628L972 486L1178 612L1331 530" stroke="url(#lineB)" strokeWidth="1.2" />
        <path d="M208 352L380 420L554 318L742 401L944 290L1114 372L1280 310" stroke="url(#lineC)" strokeWidth="1.2" />
        {[
          [102, 188],
          [294, 262],
          [446, 174],
          [631, 258],
          [842, 129],
          [1038, 251],
          [1244, 170],
          [1360, 232],
          [90, 640],
          [238, 558],
          [402, 634],
          [591, 514],
          [786, 628],
          [972, 486],
          [1178, 612],
          [1331, 530],
          [208, 352],
          [380, 420],
          [554, 318],
          [742, 401],
          [944, 290],
          [1114, 372],
          [1280, 310],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="white" fillOpacity="0.65" />
        ))}
        <defs>
          <linearGradient id="lineA" x1="102" y1="188" x2="1360" y2="232" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="lineB" x1="90" y1="640" x2="1331" y2="530" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22C55E" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="lineC" x1="208" y1="352" x2="1280" y2="310" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-5 sm:px-7 lg:px-8">
        <div className="grid w-full items-center gap-7 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden pr-6 lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_20px_50px_rgba(79,70,229,0.28)]">
                <span className="font-mono text-sm font-bold tracking-[0.16em] text-white">b</span>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">btouch</span>
            </Link>

            <div className="mt-10 max-w-lg">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/38">Developer Identity Access</div>
              <h1 className="mt-4 font-sans text-[clamp(2.4rem,4.2vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-white">
                Sign in to manage your public card.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/62">
                Access your dashboard, refresh profile data, and update your developer identity from one secure sign-in flow.
              </p>
            </div>

            <div className="mt-10 max-w-lg divide-y divide-white/8 rounded-[22px] border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              {features.map((feature) => (
                <div key={feature.title} className="px-5 py-4">
                  <div className="text-[15px] font-medium text-white">{feature.title}</div>
                  <div className="mt-1.5 text-sm leading-6 text-white/52">{feature.body}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-[520px]">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-[1px] shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
              <div className="rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(9,10,15,0.86),rgba(9,10,15,0.72))] px-4 py-4 sm:px-5 sm:py-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/42">Sign in</div>
                    <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.04em] text-white">
                      {authMode === "login" ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="mt-1 text-[11px] leading-4 text-white/54">
                      {authMode === "login" ? "Log in with your existing account." : "Create your account with magic link, GitHub, or Google."}
                    </p>
                  </div>
                  <Link href="/" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55 transition hover:bg-white/[0.05]">
                    Back
                  </Link>
                </div>

                <div className="space-y-2">
                  {error ? (
                    <div className="rounded-2xl border border-rose-400/28 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-100">
                      {error}
                    </div>
                  ) : null}
                  {message ? (
                    <div className="rounded-2xl border border-emerald-400/28 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
                      {message}
                    </div>
                  ) : null}
                </div>

                <div className="mb-3 grid grid-cols-2 rounded-2xl border border-white/8 bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setError("");
                      setMessage("");
                    }}
                    className={`h-8 rounded-[14px] text-sm font-medium transition ${
                      authMode === "login" ? "bg-white text-[#05060a]" : "text-white/62 hover:bg-white/[0.05]"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setError("");
                      setMessage("");
                    }}
                    className={`h-8 rounded-[14px] text-sm font-medium transition ${
                      authMode === "signup" ? "bg-white text-[#05060a]" : "text-white/62 hover:bg-white/[0.05]"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                <form onSubmit={handleMagicLinkSubmit} className="mt-4">
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-medium text-white/78">
                      {authMode === "login" ? "Email for magic link" : "Email to sign up with magic link"}
                    </span>
                    <input
                      type="email"
                      required
                      value={magicLinkEmail}
                      onChange={(event) => setMagicLinkEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:-translate-y-px focus:border-indigo-400/45 focus:bg-white/[0.06]"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={magicLinkLoading}
                    className="mt-2.5 inline-flex h-10.5 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(79,70,229,0.24)] transition duration-150 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {magicLinkLoading ? "Sending link..." : magicLinkEnabled ? (authMode === "login" ? "Continue with magic link" : "Sign up with magic link") : "Magic link not configured"}
                  </button>
                </form>

                <div className="my-3.5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">or continue with</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                <div className="grid gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn("github", githubEnabled, "GitHub")}
                    disabled={!githubEnabled}
                    className="flex h-10.5 w-full items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm font-medium text-white transition duration-150 hover:-translate-y-0.5 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <GitHubMark />
                    {githubEnabled ? "Continue with GitHub" : "GitHub not configured"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn("google", googleEnabled, "Google")}
                    disabled={!googleEnabled}
                    className="flex h-10.5 w-full items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm font-medium text-white transition duration-150 hover:-translate-y-0.5 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <GoogleMark />
                    {googleEnabled ? "Continue with Google" : "Google not configured"}
                  </button>
                </div>

                <div className="my-3.5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                    {authMode === "login" ? "email and password" : "signup options"}
                  </span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                {authMode === "login" ? (
                  <form onSubmit={handleManualSubmit} className="grid gap-3">
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-medium text-white/78">Email</span>
                      <input
                        type="email"
                        required
                        value={manualForm.email}
                        onChange={(event) => setManualForm((current) => ({ ...current, email: event.target.value }))}
                        className="h-10.5 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:-translate-y-px focus:border-indigo-400/45 focus:bg-white/[0.06]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[13px] font-medium text-white/78">Password</span>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={manualForm.password}
                        onChange={(event) => setManualForm((current) => ({ ...current, password: event.target.value }))}
                        className="h-10.5 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:-translate-y-px focus:border-indigo-400/45 focus:bg-white/[0.06]"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-1 inline-flex h-10.5 w-full items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-[#05060a] transition duration-150 hover:-translate-y-0.5 hover:bg-white/92 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Continuing..." : "Login with email"}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60">
                    New accounts are created through magic link, GitHub, or Google. Email and password are only available for existing accounts.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-white">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.35-3.88-1.35-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.17.91-.25 1.89-.37 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.07 0 4.41-2.68 5.38-5.24 5.67.41.35.77 1.03.77 2.08 0 1.51-.01 2.72-.01 3.09 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.95h5.49c-.24 1.27-.96 2.35-2.05 3.07l3.32 2.58c1.93-1.78 3.04-4.41 3.04-7.55 0-.72-.06-1.4-.19-2.05H12Z" />
      <path fill="#34A853" d="M12 22c2.75 0 5.05-.91 6.74-2.48l-3.32-2.58c-.92.62-2.1.99-3.42.99-2.64 0-4.88-1.79-5.68-4.18l-3.43 2.64A10.18 10.18 0 0 0 12 22Z" />
      <path fill="#4A90E2" d="M6.32 13.75A6.1 6.1 0 0 1 6 12c0-.61.11-1.2.32-1.75L2.89 7.61A10.05 10.05 0 0 0 1.82 12c0 1.61.39 3.14 1.07 4.39l3.43-2.64Z" />
      <path fill="#FBBC05" d="M12 6.07c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.04 2.99 14.75 2 12 2a10.18 10.18 0 0 0-9.11 5.61l3.43 2.64C7.12 7.86 9.36 6.07 12 6.07Z" />
    </svg>
  );
}
