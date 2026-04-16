"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type AutoSaveState = "idle" | "saving" | "saved" | "error";

interface AutoSaveIndicatorProps {
  state: AutoSaveState;
  message?: string;
  className?: string;
}

export function AutoSaveIndicator({ state, message, className }: AutoSaveIndicatorProps) {
  const [visible, setVisible] = useState(state !== "idle");

  useEffect(() => {
    if (state === "idle") {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (state !== "saved") {
      return;
    }

    const timeout = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const label =
    state === "saving"
      ? "Saving"
      : state === "saved"
        ? "Saved"
        : state === "error"
          ? "Save failed"
          : "";

  const tone =
    state === "saving"
      ? "border-white/10 bg-slate-950/90 text-white"
      : state === "saved"
        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
        : "border-rose-400/25 bg-rose-400/10 text-rose-100";

  return (
    <AnimatePresence>
      {visible && state !== "idle" ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={[
            "fixed right-4 top-4 z-50 inline-flex min-h-11 min-w-[160px] items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm shadow-2xl shadow-black/20 backdrop-blur-xl",
            tone,
            className ?? "",
          ].join(" ")}
          role={state === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {state === "saving" ? (
            <span className="inline-flex items-center gap-1">
              <span>{label}</span>
              <span className="inline-flex items-center gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0s]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
              </span>
            </span>
          ) : state === "saved" ? (
            <span className="inline-flex items-center gap-2">
              <span>Saved</span>
              <span aria-hidden="true">✓</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>{label}</span>
              {message ? <span className="text-white/70">· {message}</span> : null}
            </span>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
