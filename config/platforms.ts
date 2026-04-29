import type { WeeklyActivity } from "@/types/stats";

export const platformMeta: Record<WeeklyActivity["platform"], { name: string; color: string; abbr: WeeklyActivity["abbr"] }> = {
  github: { name: "GitHub", color: "var(--dot-github)", abbr: "GH" },
  leetcode: { name: "LeetCode", color: "var(--dot-leetcode)", abbr: "LC" },
  codeforces: { name: "Codeforces", color: "var(--dot-codeforces)", abbr: "CF" },
  gfg: { name: "GFG", color: "var(--dot-gfg)", abbr: "GFG" },
};
