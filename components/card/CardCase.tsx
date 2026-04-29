"use client";

import { AnimatePresence, motion } from "framer-motion";
import { UnlockKeyhole } from "lucide-react";
import { useState } from "react";
import type { UserConfig } from "@/types/stats";
import { usePlatformStats } from "@/hooks/usePlatformStats";
import { CardInner } from "./CardInner";
import { CoverCard } from "./CoverCard";

export function CardCase({
  config,
  editable,
  onAvatarSelect,
  initialOpen = false,
}: {
  config: UserConfig;
  editable?: boolean;
  onAvatarSelect?: (value: string) => void;
  initialOpen?: boolean;
}) {
  const { data, isLoading, isValidating } = usePlatformStats(config.handles);
  const hasStats = Boolean(config.handles.github || config.handles.leetcode || config.handles.codeforces || config.handles.gfg);
  const [showCase, setShowCase] = useState(!initialOpen);
  const [showCard, setShowCard] = useState(initialOpen);

  function openCard() {
    setShowCase(false);
    window.setTimeout(() => setShowCard(true), 400);
  }

  function retractCard() {
    setShowCard(false);
    window.setTimeout(() => setShowCase(true), 360);
  }

  return (
    <div className="btouch-mobile-scale relative flex min-h-[540px] items-start justify-center">
      <AnimatePresence mode="wait">
        {showCase ? (
          <motion.div
            key="case"
            initial={initialOpen ? false : { translateY: 14, scale: 0.97, opacity: 0 }}
            animate={{ translateY: 0, scale: 1, opacity: 1 }}
            exit={{ translateY: -22, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="relative pt-[58px]"
          >
            <div className="absolute left-1/2 top-0 h-[46px] w-[3px] -translate-x-1/2 rounded-full bg-[#1e1e1e]" />
            <div className="absolute left-1/2 top-[46px] h-[12px] w-[18px] -translate-x-1/2 rounded-t-[6px] border-x border-t border-[#383838]" />
            <div className="w-[300px] overflow-hidden rounded-[14px] border border-[var(--case-border)] bg-[var(--bg-case)] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-[var(--case-line)] bg-[var(--bg-case-top)] px-4 py-2">
                {["#6e1818", "#6e5010", "#186e18"].map((color, index) => (
                  <span key={color} className="btouch-led h-[5px] w-[5px] rounded-full" style={{ background: color, animationDelay: `${index * 0.4}s` }} />
                ))}
              </div>
              <div className="relative m-[10px] h-[434px] overflow-hidden rounded-[12px] bg-[var(--bg-window)]">
                <div className="btouch-scan-line pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[rgba(255,255,255,0.025)]" />
                <div className="pointer-events-none absolute inset-0 z-20">
                  {[
                    "left-2 top-2 border-l border-t",
                    "right-2 top-2 border-r border-t",
                    "left-2 bottom-2 border-b border-l",
                    "bottom-2 right-2 border-b border-r",
                  ].map((classes) => (
                    <span key={classes} className={`absolute h-[10px] w-[10px] border-[#2e2e2e] opacity-50 ${classes}`} />
                  ))}
                </div>
                <CoverCard config={config} />
              </div>
              <div className="flex items-center justify-center px-3 pb-3 pt-2">
                <button
                  type="button"
                  onClick={openCard}
                  className="inline-flex items-center gap-2 rounded-[7px] border border-[#2e2e2e] bg-[#1c1c1c] px-4 py-2 text-[10px] text-[rgba(216,210,200,0.42)]"
                >
                  <UnlockKeyhole className="h-3.5 w-3.5" />
                  Open card
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCard ? (
          <motion.div
            key="card"
            initial={initialOpen ? false : { translateY: 14, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -14, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.48, ease: "easeOut" }}
            className="relative"
          >
            <CardInner config={config} stats={data} loading={hasStats ? isLoading || (isValidating && !data) : false} editable={editable} onAvatarSelect={onAvatarSelect} />
            <button
              type="button"
              onClick={retractCard}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)]"
            >
              Retract card
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
