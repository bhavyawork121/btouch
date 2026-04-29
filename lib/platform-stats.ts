import { fetchWithTimeout } from "@/lib/fetchers/shared";
import { platformMeta } from "@/config/platforms";
import { computeDevScore, percentileLabel } from "@/lib/score";
import type { CodeforcesStats, GFGStats, GitHubStats, LeetCodeStats, PlatformStats, WeeklyActivity } from "@/types/stats";

function normalizeActivity(days: number[]) {
  const trimmed = days.slice(-7);
  const padded = Array.from({ length: Math.max(0, 7 - trimmed.length) }, () => 0).concat(trimmed);
  return padded.map((value) => {
    if (value <= 0) return 0;
    if (value <= 2) return 1;
    if (value <= 5) return 2;
    return 3;
  });
}

function unixDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function last7DayBuckets() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - (6 - index));
    return unixDay(d);
  });
}

function bucketCounts(items: Array<{ timestamp: number; count?: number }>) {
  const buckets = last7DayBuckets();
  const counts = new Map<number, number>();

  for (const item of items) {
    const key = unixDay(new Date(item.timestamp));
    counts.set(key, (counts.get(key) ?? 0) + (item.count ?? 1));
  }

  return buckets.map((bucket) => counts.get(bucket) ?? 0);
}

async function fetchGitHub(handle: string): Promise<GitHubStats | null> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, repoRes, contribRes] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/users/${handle}`, { headers }),
      fetchWithTimeout(`https://api.github.com/users/${handle}/repos?per_page=100`, { headers }),
      fetchWithTimeout(`https://github-contributions-api.jogruber.de/v4/${handle}`),
    ]);

    const userJson = (await userRes.json()) as { public_repos?: number };
    const repos = (await repoRes.json()) as Array<{ stargazers_count?: number; language?: string | null }>;
    const contribJson = (await contribRes.json()) as {
      total?: { [year: string]: number } | number;
      contributions?: Array<{ date: string; count: number }>;
    };

    const languageCounts = new Map<string, number>();
    let stars = 0;

    for (const repo of repos) {
      stars += repo.stargazers_count ?? 0;
      if (repo.language) {
        languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
      }
    }

    const orderedLanguages = [...languageCounts.entries()].sort((a, b) => b[1] - a[1]);
    const totalLangs = orderedLanguages.reduce((sum, [, count]) => sum + count, 0) || 1;
    const contributionDays = Array.isArray(contribJson.contributions) ? contribJson.contributions : [];
    const weeklyActivity = normalizeActivity(
      bucketCounts(
        contributionDays.map((item) => ({
          timestamp: new Date(item.date).getTime(),
          count: item.count,
        })),
      ),
    );

    const totalValue =
      typeof contribJson.total === "number"
        ? contribJson.total
        : typeof contribJson.total === "object" && contribJson.total
          ? Object.values(contribJson.total).reduce((sum, value) => sum + value, 0)
          : contributionDays.reduce((sum, item) => sum + item.count, 0);

    return {
      stars,
      contributions: totalValue,
      topLanguage: orderedLanguages[0]?.[0] ?? "—",
      repos: userJson.public_repos ?? repos.length,
      weeklyActivity,
      languageBreakdown: orderedLanguages.slice(0, 4).map(([label, count]) => ({
        label,
        percent: Math.round((count / totalLangs) * 100),
      })),
    };
  } catch {
    return null;
  }
}

async function fetchLeetCode(handle: string): Promise<LeetCodeStats | null> {
  try {
    const response = await fetchWithTimeout(`https://leetcode-stats-api.herokuapp.com/${handle}`);
    const payload = (await response.json()) as {
      status?: string;
      totalSolved?: number;
      easySolved?: number;
      mediumSolved?: number;
      hardSolved?: number;
      acceptanceRate?: number;
      ranking?: number;
      submissionCalendar?: string | Record<string, number>;
    };

    if (payload.status === "error") {
      return null;
    }

    const calendar =
      typeof payload.submissionCalendar === "string"
        ? JSON.parse(payload.submissionCalendar || "{}")
        : payload.submissionCalendar || {};

    const weeklyActivity = normalizeActivity(
      bucketCounts(
        Object.entries(calendar).map(([timestamp, count]) => ({
          timestamp: Number(timestamp) * 1000,
          count: Number(count),
        })),
      ),
    );

    return {
      solved: payload.totalSolved ?? 0,
      easySolved: payload.easySolved ?? 0,
      mediumSolved: payload.mediumSolved ?? 0,
      hardSolved: payload.hardSolved ?? 0,
      acceptanceRate: payload.acceptanceRate ?? 0,
      globalRank: payload.ranking ?? 0,
      weeklyActivity,
    };
  } catch {
    return null;
  }
}

async function fetchCodeforces(handle: string): Promise<CodeforcesStats | null> {
  try {
    const [infoRes, statusRes] = await Promise.all([
      fetchWithTimeout(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetchWithTimeout(`https://codeforces.com/api/user.status?handle=${handle}&count=200`),
    ]);

    const infoJson = (await infoRes.json()) as { status: string; result?: Array<{ rating?: number; maxRating?: number; rank?: string; contribution?: number }> };
    const statusJson = (await statusRes.json()) as { status: string; result?: Array<{ creationTimeSeconds?: number }> };

    if (infoJson.status !== "OK" || statusJson.status !== "OK") {
      return null;
    }

    const user = infoJson.result?.[0];
    const weeklyActivity = normalizeActivity(
      bucketCounts(
        (statusJson.result ?? []).map((submission) => ({
          timestamp: (submission.creationTimeSeconds ?? 0) * 1000,
          count: 1,
        })),
      ),
    );

    return {
      rating: user?.rating ?? 0,
      maxRating: user?.maxRating ?? 0,
      rank: user?.rank ?? "unrated",
      contribution: user?.contribution ?? 0,
      weeklyActivity,
    };
  } catch {
    return null;
  }
}

async function fetchGfg(handle: string): Promise<GFGStats | null> {
  try {
    const response = await fetchWithTimeout(`https://geeks-for-geeks-stats-api.vercel.app/?userName=${handle}`);
    const payload = (await response.json()) as {
      score?: number | string;
      streak?: number | string;
      currentStreak?: number | string;
      problemsSolved?: number | string;
    };

    const score = Number(payload.score ?? 0) || 0;
    const currentStreak = Number(payload.currentStreak ?? payload.streak ?? 0) || 0;
    const problemsSolved = Number(payload.problemsSolved ?? 0) || 0;
    const weeklyRaw = Array.from({ length: 7 }, (_, index) => (index >= 7 - Math.min(currentStreak, 7) ? 1 : 0));

    return {
      score,
      problemsSolved,
      currentStreak,
      weeklyActivity: normalizeActivity(weeklyRaw),
    };
  } catch {
    return null;
  }
}

export async function fetchPlatformStats(handles: {
  github?: string;
  leetcode?: string;
  codeforces?: string;
  gfg?: string;
}): Promise<PlatformStats> {
  const [github, leetcode, codeforces, gfg] = await Promise.allSettled([
    handles.github ? fetchGitHub(handles.github) : Promise.resolve(null),
    handles.leetcode ? fetchLeetCode(handles.leetcode) : Promise.resolve(null),
    handles.codeforces ? fetchCodeforces(handles.codeforces) : Promise.resolve(null),
    handles.gfg ? fetchGfg(handles.gfg) : Promise.resolve(null),
  ]);

  const result = {
    github: github.status === "fulfilled" ? github.value : null,
    leetcode: leetcode.status === "fulfilled" ? leetcode.value : null,
    codeforces: codeforces.status === "fulfilled" ? codeforces.value : null,
    gfg: gfg.status === "fulfilled" ? gfg.value : null,
  };

  const devScore = computeDevScore(result);
  const activity: WeeklyActivity[] = (Object.keys(platformMeta) as WeeklyActivity["platform"][]).map((platform) => ({
    platform,
    color: platformMeta[platform].color,
    abbr: platformMeta[platform].abbr,
    days:
      result[platform]?.weeklyActivity ??
      Array.from({ length: 7 }, () => 0),
  }));

  return {
    ...result,
    devScore,
    percentile: percentileLabel(devScore),
    lastUpdated: new Date().toISOString(),
    activity,
  };
}
