"use client";

import { motion } from "framer-motion";
import type { PlatformName, PlatformStatSummary } from "@/types/card";

const platformClasses: Record<PlatformName, string> = {
  github: "text-platform-github border-platform-github/25 bg-platform-github/10",
  leetcode: "text-platform-leetcode border-platform-leetcode/25 bg-platform-leetcode/10",
  codeforces: "text-platform-codeforces border-platform-codeforces/25 bg-platform-codeforces/10",
  gfg: "text-platform-gfg border-platform-gfg/25 bg-platform-gfg/10",
  codechef: "text-[#5b4638] border-[#5b4638]/25 bg-[#5b4638]/10",
};

export function StatBadge({ platform, summary, index }: { platform: PlatformName; summary: PlatformStatSummary; index: number }) {
  const valueColor =
    platform === "github"
      ? "#a78bfa"
      : platform === "leetcode"
        ? "#f89f1b"
        : platform === "codeforces"
          ? "#5b8dd4"
          : platform === "gfg"
            ? "#2ecc71"
            : "#5b4638";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.06 }}
      className={`min-w-0 overflow-hidden rounded-[8px] border ${platformClasses[platform]}`}
      style={{
        padding: "7px 9px",
        minHeight: 46,
        background: "rgba(255,255,255,.025)",
        border: "0.5px solid rgba(255,255,255,.055)",
      }}
    >
      <div className="truncate font-mono text-[8px] leading-none tracking-[0.1em]" style={{ color: valueColor, opacity: 0.75 }}>
        {platform.toUpperCase()}
      </div>
      <p className="mt-[2px] truncate font-display text-[19px] font-bold leading-none" style={{ color: valueColor }}>
        {summary.value}
      </p>
      <p className="mt-[2px] truncate text-[8.5px] leading-none" style={{ color: "rgba(255,255,255,.28)" }}>
        {summary.label}
      </p>
    </motion.div>
  );
}
