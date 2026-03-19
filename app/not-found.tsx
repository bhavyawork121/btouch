import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Not Found</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">That card does not exist yet.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          The requested btouch profile could not be found. Check the username or create a new card from the dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
