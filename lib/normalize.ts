import type { CardData, CardStats, ExperienceEntry, PlatformName, PlatformStatSummary } from "@/types/card";

type CardConfigLike = {
  username: string;
  theme: string;
  accentColor: string;
  showPlatforms?: string[];
  displayName?: string | null;
  headline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  currentRole?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  openToWork?: boolean | null;
  skills?: string[] | null;
  experience?: unknown;
};

function asText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
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

      return {
        role,
        company,
        duration: asText(item.duration),
        description: asText(item.description),
      };
    })
    .filter((entry): entry is ExperienceEntry => Boolean(entry));
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
    (platform): platform is PlatformName => platform === "github" || platform === "leetcode" || platform === "codeforces" || platform === "gfg",
  );

  return {
    appearance: {
      theme: card.theme === "light" || card.theme === "auto" ? card.theme : "dark",
      accentColor: card.accentColor || "indigo",
    },
    profile: {
      displayName: asText(card.displayName) ?? card.username,
      headline: asText(card.headline),
      bio: asText(card.bio),
      avatarUrl: asText(card.avatarUrl),
      linkedinUrl: asText(card.linkedinUrl),
      currentRole: asText(card.currentRole),
      currentCompany: asText(card.currentCompany),
      location: asText(card.location),
      skills: card.skills ?? [],
      openToWork: Boolean(card.openToWork),
      experience: asExperience(card.experience),
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
