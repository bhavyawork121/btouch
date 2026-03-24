"use client";

interface RouteErrorStateProps {
  title?: string;
  message?: string;
  buttonLabel?: string;
  showBrand?: boolean;
  onAction?: () => void;
}

export function RouteErrorState({
  title = "Something went wrong",
  message = "Please try again or contact support.",
  buttonLabel = "Try again",
  showBrand = true,
  onAction,
}: RouteErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        {showBrand ? <p className="text-sm uppercase tracking-[0.28em] text-slate-400">btouch</p> : null}
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">{message}</p>
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>
    </main>
  );
}
