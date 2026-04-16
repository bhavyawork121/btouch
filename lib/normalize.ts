import type { CodeChefStats } from "@/lib/codechef";
import { getPlatformConfig, type PlatformKey } from "@/lib/platforms";
import type {
  CardData,
  CardStats,
  CodeforcesStats,
  ExperienceEntry,
  GFGStats,
  GitHubStats,
  LeetCodeStats,
  PlatformName,
  PlatformStatSummary,
} from "@/types/card";

type CardConfigLike = {
  username: string;
  theme: string;
  accentColor: string;
  showPlatforms?: string[];
  displayName?: string | null;
  headline?: string | null;
  tagline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  currentRole?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  openToWork?: boolean | null;
  skills?: string[] | null;
  experience?: unknown;
  workExperience?: unknown;
  cardBackground?: string | null;
  cardFont?: string | null;
  particleEnabled?: boolean | null;
  codechefUsername?: string | null;
  codechefData?: unknown;
  isOnboarded?: boolean | null;
  cardTheme?: string | null;
};

function asText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function asStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => asText(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function asExperience(value: unknown): ExperienceEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const item = entry as Record<string, unknown>;
      const role = asText(item.role);
      const company = asText(item.company);

      if (!role || !company) {
        return null;
      }

      const duration = asText(item.duration) ?? formatDateRange(item.startDate, item.endDate);

      return {
        role,
        company,
        duration,
        description: asText(item.description),
      };
    })
    .filter((entry): entry is ExperienceEntry => Boolean(entry));
}

function formatDateRange(startDate: unknown, endDate: unknown) {
  const start = asText(startDate);
  const end = asText(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start ?? end;
}

export interface PlatformMetric {
  label: string;
  value: number | string;
}

export interface PlatformData {
  platform: PlatformKey;
  username: string;
  primaryMetric: PlatformMetric;
  secondaryMetric?: PlatformMetric;
  tertiaryMetric?: PlatformMetric;
  lastFetched: string;
  error?: string;
}

export type PlatformDataMap = Record<PlatformKey, PlatformData | null>;

function metric(label: string, value: unknown): PlatformMetric {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { label, value };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return { label, value: trimmed.length ? trimmed : "—" };
  }

  return { label, value: "—" };
}

function buildErrorPlatformData(platform: PlatformKey, username: string, error: string): PlatformData {
  return {
    platform,
    username,
    primaryMetric: metric("Status", "Unavailable"),
    secondaryMetric: metric("Platform", getPlatformConfig(platform).label),
    lastFetched: new Date().toISOString(),
    error,
  };
}

export function createEmptyPlatformData(platform: PlatformKey, username = ""): PlatformData {
  const config = getPlatformConfig(platform);

  return {
    platform,
    username,
    primaryMetric: metric("Status", "Not configured"),
    secondaryMetric: metric("Platform", config.label),
    lastFetched: new Date().toISOString(),
    error: "Not configured",
  };
}

export function createEmptyPlatformMap(username = ""): PlatformDataMap {
  return {
    github: createEmptyPlatformData("github", username),
    leetcode: createEmptyPlatformData("leetcode", username),
    gfg: createEmptyPlatformData("gfg", username),
    codeforces: createEmptyPlatformData("codeforces", username),
    codechef: createEmptyPlatformData("codechef", username),
  };
}

export function normalizePlatformData(
  platform: PlatformKey,
  raw: GitHubStats | LeetCodeStats | GFGStats | CodeforcesStats | CodeChefStats | null | undefined,
  username: string,
): PlatformData {
  if (!raw || raw.status === "error") {
    return buildErrorPlatformData(platform, username, raw?.error ?? "Failed to load stats.");
  }

  const lastFetched = raw.fetchedAt || new Date().toISOString();

  switch (platform) {
    case "github": {
      const stats = raw as GitHubStats;
      return {
        platform,
        username,
        primaryMetric: metric("Stars", stats.stars),
        secondaryMetric: metric("Contributions this year", stats.contributionsLastYear),
        tertiaryMetric: metric("Top language", stats.topLanguages[0] ?? "—"),
        lastFetched,
      };
    }
    case "leetcode": {
      const stats = raw as LeetCodeStats;
      return {
        platform,
        username,
        primaryMetric: metric("Solved", stats.solved.total),
        secondaryMetric: metric("Global rank", stats.ranking ? `#${stats.ranking.toLocaleString("en-US")}` : "—"),
        tertiaryMetric: metric("Acceptance", stats.acceptanceRate !== null ? `${stats.acceptanceRate}%` : "—"),
        lastFetched,
      };
    }
    case "gfg": {
      const stats = raw as GFGStats;
      return {
        platform,
        username,
        primaryMetric: metric("Score", stats.score),
        secondaryMetric: metric("Problems solved", stats.solved),
        tertiaryMetric: metric("Streak", stats.streak > 0 ? `${stats.streak} days` : "—"),
        lastFetched,
      };
    }
    case "codeforces": {
      const stats = raw as CodeforcesStats;
      return {
        platform,
        username,
        primaryMetric: metric(`${stats.rank} rating`, stats.rating),
        secondaryMetric: metric("Max rating", stats.maxRating),
        tertiaryMetric: metric("Contribution", stats.contribution),
        lastFetched,
      };
    }
    case "codechef": {
      const stats = raw as CodeChefStats;
      return {
        platform,
        username,
        primaryMetric: metric("Rating", stats.rating ?? "—"),
        secondaryMetric: metric("Global rank", stats.globalRank ?? "—"),
        tertiaryMetric: metric("Stars", stats.stars ? "★".repeat(stats.stars) : "—"),
        lastFetched,
        error: stats.status === "stale" ? "Partial data loaded." : undefined,
      };
    }
  }
}

export function normalizePlatformDataMap(
  data: Partial<Record<PlatformKey, GitHubStats | LeetCodeStats | GFGStats | CodeforcesStats | CodeChefStats | null | undefined>>,
  username: string,
): PlatformDataMap {
  return {
    github: normalizePlatformData("github", data.github, username),
    leetcode: normalizePlatformData("leetcode", data.leetcode, username),
    gfg: normalizePlatformData("gfg", data.gfg, username),
    codeforces: normalizePlatformData("codeforces", data.codeforces, username),
    codechef: normalizePlatformData("codechef", data.codechef, username),
  };
}

export function createEmptyCardData(username = ""): CardData {
  return {
    appearance: {
      theme: "dark",
      accentColor: "indigo",
    },
    profile: {
      displayName: null,
      headline: null,
      bio: null,
      avatarUrl: null,
      linkedinUrl: null,
      currentRole: null,
      currentCompany: null,
      location: null,
      skills: [],
      openToWork: false,
      experience: [],
    },
    stats: {
      github: null,
      leetcode: null,
      codeforces: null,
      gfg: null,
    },
    config: {
      username,
      showPlatforms: ["github", "leetcode", "codeforces", "gfg"],
      theme: "dark",
      accentColor: "indigo",
    },
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms: [],
    },
  };
}

export function normalizeCard(card: CardConfigLike, platformResults: Partial<CardStats>): CardData {
  const showPlatforms = (card.showPlatforms ?? ["github", "leetcode", "codeforces", "gfg"]).filter(
    (platform): platform is PlatformName =>
      platform === "github" || platform === "leetcode" || platform === "codeforces" || platform === "gfg",
  );

  return {
    appearance: {
      theme: card.theme === "light" || card.theme === "auto" ? card.theme : "dark",
      accentColor: card.accentColor || "indigo",
    },
    profile: {
      displayName: asText(card.displayName) ?? card.username,
      headline: asText(card.tagline) ?? asText(card.headline),
      bio: asText(card.bio),
      avatarUrl: asText(card.avatarUrl),
      linkedinUrl: asText(card.linkedinUrl),
      currentRole: asText(card.currentRole),
      currentCompany: asText(card.currentCompany),
      location: asText(card.location),
      skills: asStringList(card.skills),
      openToWork: Boolean(card.openToWork),
      experience: asExperience(card.workExperience ?? card.experience),
    },
    stats: {
      github: platformResults.github ?? null,
      leetcode: platformResults.leetcode ?? null,
      codeforces: platformResults.codeforces ?? null,
      gfg: platformResults.gfg ?? null,
    },
    config: {
      username: card.username,
      showPlatforms,
      theme: card.theme === "light" || card.theme === "auto" ? card.theme : "dark",
      accentColor: card.accentColor || "indigo",
    },
    meta: {
      lastRefreshed: new Date().toISOString(),
      stalePlatforms: [],
    },
  };
}

export function summarizeStats(stats: CardStats): PlatformStatSummary[] {
  return [
    {
      platform: "github",
      status: stats.github?.status ?? "error",
      label: "followers",
      value: stats.github?.status ? String(stats.github?.followers ?? "") : "",
      detail: stats.github?.status ? "" : "",
    },
    {
      platform: "leetcode",
      status: stats.leetcode?.status ?? "error",
      label: "problems solved",
      value: stats.leetcode?.status ? String(stats.leetcode?.solved.total ?? "") : "",
      detail: stats.leetcode?.status ? "" : "",
    },
    {
      platform: "codeforces",
      status: stats.codeforces?.status ?? "error",
      label: "current rating",
      value: stats.codeforces?.status ? String(stats.codeforces?.rating ?? "") : "",
      detail: stats.codeforces?.status ? "" : "",
    },
    {
      platform: "gfg",
      status: stats.gfg?.status ?? "error",
      label: "practice score",
      value: stats.gfg?.status ? String(stats.gfg?.score ?? "") : "",
      detail: stats.gfg?.status ? "" : "",
    },
  ];
}

