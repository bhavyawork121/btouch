import type { PlatformStats } from "@/types/stats";

export function computeDevScore(stats: Pick<PlatformStats, "github" | "leetcode" | "codeforces" | "gfg">): number {
  const weights = { github: 0.3, leetcode: 0.25, codeforces: 0.25, gfg: 0.2 };
  let total = 0;
  let totalWeight = 0;

  if (stats.github) {
    const score = Math.min(stats.github.contributions / 500, 1) * 0.6 + Math.min(stats.github.stars / 100, 1) * 0.4;
    total += score * weights.github * 1000;
    totalWeight += weights.github;
  }

  if (stats.leetcode) {
    const score = Math.min(stats.leetcode.solved / 500, 1) * 0.7 + (stats.leetcode.acceptanceRate / 100) * 0.3;
    total += score * weights.leetcode * 1000;
    totalWeight += weights.leetcode;
  }

  if (stats.codeforces) {
    const score = Math.min(stats.codeforces.rating / 3000, 1);
    total += score * weights.codeforces * 1000;
    totalWeight += weights.codeforces;
  }

  if (stats.gfg) {
    const score = Math.min(stats.gfg.score / 1000, 1) * 0.6 + Math.min(stats.gfg.problemsSolved / 300, 1) * 0.4;
    total += score * weights.gfg * 1000;
    totalWeight += weights.gfg;
  }

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round(total / totalWeight);
}

export function percentileLabel(score: number): string {
  if (score >= 900) return "Top 1% globally";
  if (score >= 800) return "Top 5% globally";
  if (score >= 700) return "Top 12% globally";
  if (score >= 600) return "Top 25% globally";
  if (score >= 500) return "Top 40% globally";
  return "Keep grinding";
}
