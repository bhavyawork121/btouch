import { ArrowLeft } from "lucide-react";
import { platformMeta } from "@/config/platforms";
import { formatCount, formatRating, formatRelTime } from "@/lib/formatters";
import type { PlatformStats } from "@/types/stats";
import { Heatmap } from "./Heatmap";
import { ScoreRing } from "./ScoreRing";

function platformValue(stats: PlatformStats, key: keyof Pick<PlatformStats, "github" | "leetcode" | "codeforces" | "gfg">) {
  switch (key) {
    case "github":
      return stats.github
        ? {
            primary: `${formatCount(stats.github.contributions)} commits`,
            secondary: `/ ${formatCount(stats.github.stars)} stars`,
          }
        : { primary: "—", secondary: "—" };
    case "leetcode":
      return stats.leetcode
        ? {
            primary: `${formatCount(stats.leetcode.solved)} solved`,
            secondary: `/ ${Math.round(stats.leetcode.acceptanceRate)}% acc`,
          }
        : { primary: "—", secondary: "—" };
    case "codeforces":
      return stats.codeforces
        ? {
            primary: `${formatRating(stats.codeforces.rating)} rating`,
            secondary: `/ ${stats.codeforces.rank}`,
          }
        : { primary: "—", secondary: "—" };
    case "gfg":
      return stats.gfg
        ? {
            primary: `${formatCount(stats.gfg.score)} score`,
            secondary: `/ ${formatCount(stats.gfg.problemsSolved)} solved`,
          }
        : { primary: "—", secondary: "—" };
  }
}

export function CardBack({
  handles,
  stats,
  onFlip,
}: {
  handles: { github: string; leetcode: string; codeforces: string; gfg: string };
  stats: PlatformStats;
  onFlip: () => void;
}) {
  const allUnavailable = !stats.github && !stats.leetcode && !stats.codeforces && !stats.gfg;

  return (
    <div className="relative h-[499px] w-[300px] overflow-hidden rounded-[14px] border border-[#222] bg-[var(--bg-card-back)] text-[var(--back-text)]">
      <div className="flex items-center justify-between border-b border-[#1e1e1e] bg-[#0a0a0a] px-[14px] py-[10px]">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[rgba(216,210,200,0.25)]">Platform stats</p>
        <p className="text-[10px] text-[rgba(216,210,200,0.18)]">↻ {formatRelTime(stats.lastUpdated)}</p>
      </div>
      <div className="h-[2px] bg-[var(--accent-dark)]" />
      <div className="h-[22px] border-y border-[#151515] bg-[#070707]" />
      <div className="flex h-[calc(100%-56px)] flex-col px-[14px] py-[11px]">
        {allUnavailable ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-[12px] leading-6 text-[rgba(216,210,200,0.35)]">
            Stats temporarily unavailable. Pull to refresh.
          </div>
        ) : (
          <>
            <div className="rounded-[9px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.025)] px-[10px] py-[4px]">
              {(Object.keys(platformMeta) as Array<keyof typeof platformMeta>).map((platform, index, list) => {
                const value = platformValue(stats, platform);
                const handle = handles[platform];
                return (
                  <div
                    key={platform}
                    className={`flex items-center justify-between py-[6px] ${index < list.length - 1 ? "border-b border-[rgba(255,255,255,0.04)]" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-[7px] w-[7px] rounded-full" style={{ background: platformMeta[platform].color }} />
                      <span className="text-[11px] font-semibold text-[#d0cec8]">{platformMeta[platform].name}</span>
                      <span className="text-[9px] text-[rgba(216,210,200,0.25)]">{handle ? `@${handle}` : "—"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-[#e0ddd8]">{value.primary}</span>
                      <span className="ml-1 text-[9px] text-[rgba(216,210,200,0.25)]">{value.secondary}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[8px] uppercase tracking-[0.18em] text-[rgba(216,210,200,0.22)]">Weekly activity</p>
              <Heatmap activity={stats.activity} />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-[10px]">
              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] text-[rgba(216,210,200,0.25)]">Dev score</p>
                <p className="mt-1 font-serif text-[26px] font-bold text-[#e0ddd8]">{stats.devScore > 0 ? stats.devScore : "—"}</p>
                <p className="text-[10px] text-[rgba(216,210,200,0.3)]">{stats.devScore > 0 ? stats.percentile : "Keep grinding"}</p>
              </div>
              <ScoreRing score={stats.devScore} />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onFlip}
          className="mt-auto ml-auto inline-flex items-center gap-2 rounded-full border border-[#2e2e2e] bg-[#111] px-[12px] py-[5px] text-[10px] text-[rgba(216,210,200,0.5)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Profile
        </button>
      </div>
    </div>
  );
}
