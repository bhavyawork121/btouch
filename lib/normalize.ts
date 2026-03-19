import type {
  CardData,
  CardTheme,
  CardStats,
  CodeforcesStats,
  GFGStats,
  GitHubStats,
  LeetCodeStats,
  PlatformName,
  PlatformStatSummary,
} from "@/types/card";

export function createEmptyCardData(username = "preview"): CardData {
  return {
    appearance: {
      theme: "dark",
      accentColor: "indigo",
    },
    profile: {
      displayName: username,
      headline: "Full-stack engineer",
      bio: "Builds resilient systems, animated interfaces, and sensible product surfaces.",
      avatarUrl: null,
      linkedinUrl: null,
      currentRole: "Software Engineer",
      currentCompany: "btouch",
    },
    stats: {
      github: null,
      leetcode: null,
      codeforces: null,
      gfg: null,
    },
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms: [],
    },
  };
}

export function buildPreviewCardData(): CardData {
  return {
    appearance: {
      theme: "dark",
      accentColor: "indigo",
    },
    profile: {
      displayName: "Rahul Sharma",
      headline: "Senior Frontend Engineer building expressive product systems",
      bio: "I design interfaces with measurable motion, clean data boundaries, and enough discipline to stay maintainable.",
      avatarUrl: null,
      linkedinUrl: "https://www.linkedin.com/in/rahul-sharma",
      currentRole: "Staff Engineer",
      currentCompany: "Arc Foundry",
    },
    stats: {
      github: {
        status: "ok",
        handle: "rahul-s",
        followers: 824,
        publicRepos: 62,
        stars: 1380,
        contributionsLastYear: 924,
        topLanguages: ["TypeScript", "Go", "Rust"],
        heatmap: Array.from({ length: 56 }, (_, index) => index % 5),
        profileUrl: "https://github.com/rahul-s",
        avatarUrl: null,
        bio: null,
        fetchedAt: new Date().toISOString(),
      },
      leetcode: {
        status: "ok",
        handle: "rahul-s",
        solved: { easy: 214, medium: 388, hard: 92, total: 694 },
        ranking: 14567,
        acceptanceRate: 68,
        streak: 47,
        percentile: 93,
        badge: "gold",
        avatarUrl: null,
        fetchedAt: new Date().toISOString(),
      },
      codeforces: {
        status: "ok",
        handle: "rahul_s",
        rating: 1764,
        maxRating: 1880,
        rank: "expert",
        maxRank: "candidate master",
        contribution: 28,
        avatarUrl: null,
        fetchedAt: new Date().toISOString(),
      },
      gfg: {
        status: "ok",
        handle: "rahuls",
        score: 1742,
        streak: 23,
        solved: 511,
        instituteRank: "24",
        fetchedAt: new Date().toISOString(),
      },
    },
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms: [],
    },
  };
}

export function normalizeCardData(input: {
  appearance?: {
    theme?: CardTheme;
    accentColor?: string;
  };
  profile: CardData["profile"];
  stats: CardStats;
}): CardData {
  const stalePlatforms = (Object.entries(input.stats) as [PlatformName, GitHubStats | LeetCodeStats | CodeforcesStats | GFGStats | null][])
    .filter(([, value]) => value?.status === "stale" || value?.status === "error")
    .map(([platform]) => platform);

  return {
    appearance: {
      theme: input.appearance?.theme ?? "dark",
      accentColor: input.appearance?.accentColor ?? "indigo",
    },
    profile: input.profile,
    stats: input.stats,
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms,
    },
  };
}

export function summarizeStats(stats: CardStats): PlatformStatSummary[] {
  return [
    {
      platform: "github",
      status: stats.github?.status ?? "error",
      label: "followers",
      value: stats.github?.status === "error" ? "Unavailable" : String(stats.github?.followers ?? 0),
      detail:
        stats.github?.status === "stale"
          ? "Showing cached GitHub data"
          : stats.github?.status === "error"
            ? "GitHub sync failed"
            : "Live GitHub signal",
    },
    {
      platform: "leetcode",
      status: stats.leetcode?.status ?? "error",
      label: "problems solved",
      value: stats.leetcode?.status === "error" ? "Unavailable" : String(stats.leetcode?.solved.total ?? 0),
      detail:
        stats.leetcode?.status === "stale"
          ? "Showing cached LeetCode data"
          : stats.leetcode?.status === "error"
            ? "LeetCode sync failed"
            : "Live LeetCode signal",
    },
    {
      platform: "codeforces",
      status: stats.codeforces?.status ?? "error",
      label: "current rating",
      value: stats.codeforces?.status === "error" ? "Unavailable" : String(stats.codeforces?.rating ?? 0),
      detail:
        stats.codeforces?.status === "stale"
          ? "Showing cached Codeforces data"
          : stats.codeforces?.status === "error"
            ? "Codeforces sync failed"
            : "Live Codeforces signal",
    },
    {
      platform: "gfg",
      status: stats.gfg?.status ?? "error",
      label: "practice score",
      value: stats.gfg?.status === "error" ? "Unavailable" : String(stats.gfg?.score ?? 0),
      detail:
        stats.gfg?.status === "stale"
          ? "Showing cached GFG data"
          : stats.gfg?.status === "error"
            ? "GFG sync failed"
            : "Live GFG signal",
    },
  ];
}
