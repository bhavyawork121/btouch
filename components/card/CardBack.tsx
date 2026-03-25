"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { summarizeStats } from "@/lib/normalize";
import type { CardData } from "@/types/card";
import { StatBadge } from "./StatBadge";

type IdleBrowserWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

const heatmapVariants = {
  hidden: { opacity: 0, scale: 0.985 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.008, duration: 0.35, ease: "easeOut" },
  },
};

function getHeatmapColor(index: number): string {
  const levels = [
    "rgba(167,139,250,0.08)",
    "rgba(167,139,250,0.08)",
    "rgba(167,139,250,0.08)",
    "rgba(167,139,250,0.08)",
    "rgba(167,139,250,0.25)",
    "rgba(167,139,250,0.25)",
    "rgba(167,139,250,0.50)",
    "rgba(167,139,250,0.50)",
    "rgba(167,139,250,0.75)",
    "rgba(167,139,250,1.00)",
  ];
  const seed = (index * 17 + 31) % levels.length;
  return levels[seed] ?? levels[0];
}

export function CardBack({
  data,
  onScrollIndexChange,
}: {
  data: CardData;
  onScrollIndexChange?: (index: number) => void;
}) {
  const summaries = summarizeStats(data.stats);
  const hasStats = Boolean(data.stats.github || data.stats.leetcode || data.stats.codeforces || data.stats.gfg);
  const [heatmapReady, setHeatmapReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const browserWindow = window as IdleBrowserWindow;
    const callback = () => setHeatmapReady(true);

    if (browserWindow.requestIdleCallback) {
      const id = browserWindow.requestIdleCallback(callback);
      return () => browserWindow.cancelIdleCallback?.(id);
    }

    const timeoutId = browserWindow.setTimeout(callback, 120);
    return () => browserWindow.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    let hintHidden = false;
    const handleScroll = () => {
      if (!hintHidden) {
        const hint = document.getElementById("back-scroll-hint");
        if (hint) {
          hint.style.opacity = "0";
        }
        hintHidden = true;
      }

      if (!scrollElement) {
        return;
      }

      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
      const ratio = maxScroll > 0 ? scrollElement.scrollTop / maxScroll : 0;
      const nextIndex = Math.min(2, Math.floor(ratio * 3));
      onScrollIndexChange?.(nextIndex);
    };

    onScrollIndexChange?.(0);
    scrollElement?.addEventListener("scroll", handleScroll);
    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, [onScrollIndexChange]);

  const streakValue = data.stats.leetcode?.streak ?? data.stats.gfg?.streak ?? null;
  const streak = useCountUp(streakValue ?? 0, 800);
  const rankLabel = data.stats.leetcode?.percentile
    ? `Top ${Math.max(1, 100 - Math.round(data.stats.leetcode.percentile))}% · LeetCode`
    : rankLabelFallback(data);
  const handle = data.config.username;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex h-full w-full flex-col rounded-[18px] border"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "12px 14px 10px",
        overflow: "hidden",
        width: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        borderColor: "var(--card-border)",
        background: "#08090e",
      }}
    >
        <div
        ref={scrollRef}
        data-scroll-face="back"
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
          boxSizing: "border-box",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {!hasStats ? (
          <div
            style={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "var(--font-space-mono)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textAlign: "center",
              padding: "16px 8px",
            }}
          >
            no stats available yet
          </div>
        ) : null}

        <div className="mb-[10px] flex min-w-0 items-center justify-between gap-4">
          <p
            className="truncate text-[8px] uppercase"
            style={{ color: "#2e4a60", fontFamily: "var(--font-space-mono)", letterSpacing: "0.16em" }}
          >
            {"// coding stats"}
          </p>
          <p className="truncate text-[8px]" style={{ color: "#1e6644", fontFamily: "var(--font-space-mono)" }}>
            @{handle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 6,
            marginBottom: 8,
          }}
        >
          {summaries.map((summary, index) => (
            <StatBadge key={summary.platform} platform={summary.platform} summary={summary} index={index} />
          ))}
        </div>

        <div
          style={{
            background:
              "radial-gradient(120% 120% at 50% 20%, rgba(167,139,250,0.08) 0%, rgba(255,255,255,0.025) 40%, rgba(255,255,255,0.012) 100%)",
            border: "0.5px solid rgba(255,255,255,.05)",
            borderRadius: 14,
            padding: "11px 11px 10px",
            marginBottom: 8,
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.18), 0 10px 30px rgba(0,0,0,0.14)",
            animation: "heatmapBreath 8s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(closest-side at 50% 50%, transparent 60%, rgba(8,9,14,0.24) 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 8.5,
              fontFamily: "var(--font-jetbrains-mono)",
              color: "#a78bfa",
              opacity: 0.7,
              letterSpacing: "0.1em",
              marginBottom: 7,
            }}
          >
            CONTRIB HEATMAP
          </div>
          <motion.div
            variants={heatmapVariants}
            initial="hidden"
            animate={heatmapReady ? "show" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(13, 1fr)",
              gap: 3.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            {Array.from({ length: 91 }, (_, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                style={{
                  aspectRatio: "1",
                  borderRadius: 5,
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 34%, transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.05)), ${getHeatmapColor(index)}`,
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 1px rgba(255,255,255,0.04), 0 0 0 1px rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </motion.div>
          <div
            className="mt-[5px] flex items-center justify-between"
            style={{ fontSize: 7.5, fontFamily: "var(--font-jetbrains-mono)", color: "rgba(255,255,255,.2)" }}
          >
            <span>13 weeks</span>
            <span>91 days</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.26 }}
            style={{
              flex: 1,
              background: "rgba(255,255,255,.025)",
              border: "0.5px solid rgba(255,255,255,.055)",
              borderRadius: 8,
              padding: "9px 10px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "rgba(248,159,27,.5)",
                  letterSpacing: "0.1em",
                  marginBottom: 3,
                }}
              >
                DAY STREAK
              </div>
              {streakValue !== null ? (
                <div className="font-display text-[26px] font-bold leading-none" style={{ color: "#f89f1b" }}>
                  {streak}
                </div>
              ) : (
                <div style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.06em" }}>
                  no streak data
                </div>
              )}
            </div>
            <div style={{ fontSize: 22 }}>🔥</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.32 }}
            style={{
              flex: 1,
              background: "rgba(255,255,255,.025)",
              border: "0.5px solid rgba(255,255,255,.055)",
              borderRadius: 8,
              padding: "9px 10px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontFamily: "var(--font-jetbrains-mono)",
                color: "rgba(248,159,27,.5)",
                letterSpacing: "0.1em",
                marginBottom: 3,
              }}
            >
              LEETCODE RANK
            </div>
            <div className="font-display text-[16px] font-bold leading-none" style={{ color: "#f89f1b" }}>
              {rankLabel || " "}
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.28)", marginTop: 3 }}>global ranking</div>
          </motion.div>
        </div>

        <div
          id="back-scroll-hint"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginBottom: 8,
            fontSize: 8.5,
            fontFamily: "var(--font-jetbrains-mono)",
            color: "rgba(255,255,255,.15)",
            letterSpacing: "0.1em",
            transition: "opacity .4s",
          }}
        >
          scroll for more ↓
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <span
            style={{
              fontSize: 8,
              fontFamily: "var(--font-jetbrains-mono)",
              color: "rgba(255,255,255,.08)",
              letterSpacing: "0.2em",
            }}
          >
            btouch.dev
          </span>
        </div>
      </div>
      <style jsx global>{`
        [data-scroll-face="back"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}

function rankLabelFallback(data: CardData) {
  if (data.stats.codeforces?.rank) {
    return data.stats.codeforces.rank;
  }

  if (data.stats.leetcode?.badge) {
    return data.stats.leetcode.badge;
  }

  return "";
}
