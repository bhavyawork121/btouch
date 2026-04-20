import { clearPlatformCache, getCachedPlatform, savePlatformCache } from "@/lib/dbCache";
import { fetchCodeChefStats } from "@/lib/codechef";
import { fetchCodeforcesStats } from "@/lib/fetchers/codeforces";
import { fetchGfgStats } from "@/lib/fetchers/gfg";
import { fetchGitHubStats } from "@/lib/fetchers/github";
import { fetchLeetCodeStats } from "@/lib/fetchers/leetcode";
import { prisma } from "@/lib/prisma";
import { createEmptyCardData, normalizeCard } from "@/lib/normalize";
import type { CardStats, PlatformName } from "@/types/card";

type CardRecord = {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  skills: string[];
  openToWork: boolean;
  githubHandle: string;
  leetcodeHandle: string;
  cfHandle: string;
  gfgHandle: string;
  codechefUsername?: string | null;
  theme: string;
  accentColor: string;
  showPlatforms: string[];
  experience: unknown;
};

const platformOrder: PlatformName[] = ["github", "leetcode", "codeforces", "gfg", "codechef"];

const fetcherMap: Record<PlatformName, (handle: string) => Promise<unknown>> = {
  github: fetchGitHubStats,
  leetcode: fetchLeetCodeStats,
  codeforces: fetchCodeforcesStats,
  gfg: fetchGfgStats,
  codechef: fetchCodeChefStats,
};

function getHandles(config: CardRecord) {
  return {
    github: config.githubHandle || "",
    leetcode: config.leetcodeHandle || "",
    codeforces: config.cfHandle || "",
    gfg: config.gfgHandle || "",
    codechef: config.codechefUsername || "",
  } satisfies Record<PlatformName, string>;
}

async function loadPlatformStats(config: CardRecord, refreshPlatforms: PlatformName[] = []): Promise<CardStats> {
  const handles = getHandles(config);
  const refreshSet = new Set(refreshPlatforms);
  const enabled = new Set((config.showPlatforms as PlatformName[]).filter((platform): platform is PlatformName => platformOrder.includes(platform as PlatformName)));

  const stats: CardStats = {
    github: null,
    leetcode: null,
    codeforces: null,
    gfg: null,
    codechef: null,
  };

  await Promise.allSettled(
    platformOrder.map(async (platform) => {
      if (!enabled.has(platform) && !(platform === "codechef" && handles.codechef)) {
        return;
      }

      const handle = handles[platform];
      if (!handle) {
        return;
      }

      if (refreshSet.has(platform)) {
        await clearPlatformCache(config.username, platform);
      }

      if (!refreshSet.has(platform)) {
        const cached = await getCachedPlatform<CardStats[typeof platform]>(config.username, platform);
        if (cached) {
          switch (platform) {
            case "github":
              stats.github = cached as CardStats["github"];
              break;
            case "leetcode":
              stats.leetcode = cached as CardStats["leetcode"];
              break;
            case "codeforces":
              stats.codeforces = cached as CardStats["codeforces"];
              break;
            case "gfg":
              stats.gfg = cached as CardStats["gfg"];
              break;
            case "codechef":
              stats.codechef = cached as CardStats["codechef"];
              break;
          }
          return;
        }
      }

      const value = (await fetcherMap[platform](handle)) as CardStats[typeof platform];
      await savePlatformCache(config.username, platform, value);
      switch (platform) {
        case "github":
          stats.github = value as CardStats["github"];
          break;
        case "leetcode":
          stats.leetcode = value as CardStats["leetcode"];
          break;
        case "codeforces":
          stats.codeforces = value as CardStats["codeforces"];
          break;
        case "gfg":
          stats.gfg = value as CardStats["gfg"];
          break;
        case "codechef":
          stats.codechef = value as CardStats["codechef"];
          break;
      }
    }),
  );

  return stats;
}

async function getCardConfigByUsername(username: string) {
  const card = await prisma.cardConfig.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!card) {
    return null;
  }

  return card as CardRecord;
}

export async function getCardDataByUsername(username: string, options: { refreshPlatforms?: PlatformName[] } = {}) {
  const card = await getCardConfigByUsername(username);

  if (!card) {
    return null;
  }

  const stats = await loadPlatformStats(card, options.refreshPlatforms);

  return normalizeCard(card, stats);
}

export async function getDashboardPreviewData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { card: true },
  });

  if (!user?.card) {
    const data = createEmptyCardData("");
    return {
      username: "",
      linkedinHandle: "",
      handles: {
        github: "",
        leetcode: "",
        codeforces: "",
        gfg: "",
      },
      theme: "dark",
      accentColor: "indigo",
      data,
    };
  }

  const card = user.card as CardRecord;
  const stats = await loadPlatformStats(card);

  return {
    username: card.username,
    linkedinHandle: card.linkedinUrl.trim().replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, ""),
    handles: {
      github: card.githubHandle,
      leetcode: card.leetcodeHandle,
      codeforces: card.cfHandle,
      gfg: card.gfgHandle,
    },
    theme: card.theme,
    accentColor: card.accentColor,
    data: normalizeCard(card, stats),
  };
}
