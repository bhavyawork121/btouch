import { clearCache, getFromCache, saveToCache } from "@/lib/dbCache";
import { fetchCodeforcesStats } from "@/lib/fetchers/codeforces";
import { fetchGfgStats } from "@/lib/fetchers/gfg";
import { fetchGitHubStats } from "@/lib/fetchers/github";
import { fetchLeetCodeStats } from "@/lib/fetchers/leetcode";
import { connectDB } from "@/lib/mongodb";
import { CardConfig, type ICardConfig } from "@/lib/models/CardConfig";
import { User } from "@/lib/models/User";
import { buildPreviewCardData, createEmptyCardData, normalizeCardData } from "@/lib/normalize";
import type { CardData, CardStats, PlatformName } from "@/types/card";

const platformOrder: PlatformName[] = ["github", "leetcode", "codeforces", "gfg"];
interface GetCardDataOptions {
  refreshPlatforms?: PlatformName[];
}

function profileFromConfig(config: ICardConfig): CardData["profile"] {
  return {
    displayName: config.displayName || config.username,
    headline: config.headline || "Developer",
    bio: config.bio || "Add your bio in the dashboard.",
    avatarUrl: config.avatarUrl || null,
    linkedinUrl: config.linkedinUrl || null,
    currentRole: config.currentRole || null,
    currentCompany: config.currentCompany || null,
  };
}

function appearanceFromConfig(config: ICardConfig): CardData["appearance"] {
  return {
    theme: config.theme === "light" || config.theme === "auto" ? config.theme : "dark",
    accentColor: config.accentColor,
  };
}

function extractLinkedInHandle(linkedinUrl: string) {
  const trimmed = linkedinUrl.trim();

  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/linkedin\.com\/in\/([^/?#]+)/i);
  if (match?.[1]) {
    return match[1];
  }

  return trimmed.replace(/^@/, "");
}

async function loadPlatformStats(config: ICardConfig, refreshPlatforms: PlatformName[] = []): Promise<CardStats> {
  const handles = {
    github: config.githubHandle || "",
    leetcode: config.leetcodeHandle || "",
    codeforces: config.cfHandle || "",
    gfg: config.gfgHandle || "",
  };
  const refreshSet = new Set(refreshPlatforms);

  const settled = await Promise.allSettled(
    platformOrder.map(async (platform) => {
      const handle = handles[platform];

      if (!handle) {
        return [platform, null] as const;
      }

      if (refreshSet.has(platform)) {
        await clearCache(config.username, platform);
      }

      if (!refreshSet.has(platform)) {
        const cached = await getFromCache<CardStats[typeof platform]>(config.username, platform);

        if (cached) {
          return [platform, cached] as const;
        }
      }

      const value =
        platform === "github"
          ? await fetchGitHubStats(handle)
          : platform === "leetcode"
            ? await fetchLeetCodeStats(handle)
            : platform === "codeforces"
              ? await fetchCodeforcesStats(handle)
              : await fetchGfgStats(handle);

      void saveToCache(config.username, platform, value);

      return [platform, value] as const;
    }),
  );

  const stats: CardStats = {
    github: null,
    leetcode: null,
    codeforces: null,
    gfg: null,
  };

  for (const result of settled) {
    if (result.status !== "fulfilled") {
      continue;
    }

    const [platform, value] = result.value;
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
    }
  }

  return stats;
}

export async function getCardDataByUsername(username: string, options: GetCardDataOptions = {}) {
  await connectDB();
  const config = await CardConfig.findOne({ username: username.toLowerCase() }).lean();

  if (!config) {
    return username === "rahul-s" ? buildPreviewCardData() : null;
  }

  const stats = await loadPlatformStats(config, options.refreshPlatforms);
  return normalizeCardData({ appearance: appearanceFromConfig(config), profile: profileFromConfig(config), stats });
}

export async function getDashboardPreviewData(email: string) {
  await connectDB();
  const user = await User.findOne({ email }).lean();

  if (!user) {
    const data = createEmptyCardData("preview");
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

  const cardConfig = await CardConfig.findOne({ userId: user._id }).lean();

  if (!cardConfig) {
    const data = createEmptyCardData(user.name ?? "preview");
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

  const stats = await loadPlatformStats(cardConfig);

  return {
    username: cardConfig.username,
    linkedinHandle: extractLinkedInHandle(cardConfig.linkedinUrl),
    handles: {
      github: cardConfig.githubHandle,
      leetcode: cardConfig.leetcodeHandle,
      codeforces: cardConfig.cfHandle,
      gfg: cardConfig.gfgHandle,
    },
    theme: cardConfig.theme,
    accentColor: cardConfig.accentColor,
    data: normalizeCardData({
      appearance: appearanceFromConfig(cardConfig),
      profile: profileFromConfig(cardConfig),
      stats,
    }),
  };
}
