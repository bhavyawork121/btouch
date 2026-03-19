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
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.008 } },
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

  const streakValue = data.stats.leetcode?.streak ?? data.stats.gfg?.streak ?? 0;
  const streak = useCountUp(streakValue, 800);
  const rankLabel = data.stats.leetcode?.percentile
    ? `Top ${Math.max(1, 100 - Math.round(data.stats.leetcode.percentile))}% · LeetCode`
    : rankLabelFallback(data);
  const handle = data.stats.github?.handle ?? data.stats.leetcode?.handle ?? data.stats.codeforces?.handle ?? data.stats.gfg?.handle ?? "btouch";

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
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          boxSizing: "border-box",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
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
            background: "rgba(255,255,255,.025)",
            border: "0.5px solid rgba(255,255,255,.055)",
            borderRadius: 8,
            padding: "9px 10px",
            marginBottom: 8,
          }}
        >
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
              gap: 2.5,
            }}
          >
            {Array.from({ length: 91 }, (_, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                style={{ aspectRatio: "1", borderRadius: 1.5, background: getHeatmapColor(index) }}
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
              <div className="font-display text-[26px] font-bold leading-none" style={{ color: "#f89f1b" }}>
                {streak}
              </div>
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
              {rankLabel}
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

  return "unranked";
}
