"use client";

interface RouteErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function RouteErrorState({
  title,
  description,
  actionLabel = "Try again",
  onAction,
}: RouteErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">btouch</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </main>
  );
}
