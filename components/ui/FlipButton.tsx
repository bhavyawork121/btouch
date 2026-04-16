"use client";

import { ArrowLeftRight } from "lucide-react";

interface FlipButtonProps {
  isFlipped: boolean;
  onClick: () => void;
  className?: string;
}

export function FlipButton({ isFlipped, onClick, className }: FlipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isFlipped ? "Show card front" : "Show card back"}
      className={[
        "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/20 backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        className ?? "",
      ].join(" ")}
    >
      <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
      <span>{isFlipped ? "Front" : "Flip"}</span>
    </button>
  );
}
