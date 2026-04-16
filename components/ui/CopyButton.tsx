"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardCopy } from "lucide-react";
import { useEffect, useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  resetAfterMs?: number;
  onCopied?: () => void;
}

export function CopyButton({ value, label = "Copy", className, resetAfterMs = 2000, onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), resetAfterMs);
    return () => window.clearTimeout(timeout);
  }, [copied, resetAfterMs]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        className ?? "",
      ].join(" ")}
      aria-label={copied ? `${label} copied` : `${label} to clipboard`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center"
          >
            <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center"
          >
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
