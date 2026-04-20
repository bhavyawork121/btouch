import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchCodeChefStats } from "@/lib/codechef";
import { getCachedPlatform, savePlatformCache } from "@/lib/dbCache";
import { fetchCodeforcesStats } from "@/lib/fetchers/codeforces";
import { fetchGfgStats } from "@/lib/fetchers/gfg";
import { fetchGitHubStats } from "@/lib/fetchers/github";
import { fetchLeetCodeStats } from "@/lib/fetchers/leetcode";
import { normalizePlatformData, type PlatformData } from "@/lib/normalize";
import { PLATFORM_KEYS, type PlatformKey, isPlatformKey } from "@/lib/platforms";

const paramsSchema = z.object({
  platform: z.string().trim().toLowerCase(),
  username: z.string().trim().min(2).max(80).regex(/^[a-zA-Z0-9-_]+$/),
});

const metricSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
});

const platformDataSchema: z.ZodType<PlatformData> = z.object({
  platform: z.enum(PLATFORM_KEYS),
  username: z.string(),
  primaryMetric: metricSchema,
  secondaryMetric: metricSchema.optional(),
  tertiaryMetric: metricSchema.optional(),
  lastFetched: z.string(),
  error: z.string().optional(),
  dataUnavailable: z.boolean().optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
});

type PlatformFetcherResult =
  | Awaited<ReturnType<typeof fetchGitHubStats>>
  | Awaited<ReturnType<typeof fetchLeetCodeStats>>
  | Awaited<ReturnType<typeof fetchGfgStats>>
  | Awaited<ReturnType<typeof fetchCodeforcesStats>>
  | Awaited<ReturnType<typeof fetchCodeChefStats>>;

const fetcherMap: Record<PlatformKey, (username: string) => Promise<PlatformFetcherResult>> = {
  github: fetchGitHubStats,
  leetcode: fetchLeetCodeStats,
  gfg: fetchGfgStats,
  codeforces: fetchCodeforcesStats,
  codechef: fetchCodeChefStats,
};

function getCacheKey(username: string) {
  return username.toLowerCase().trim();
}

function isCachedError(message: string) {
  return /not found|unknown|invalid|missing|failed/i.test(message);
}

export async function GET(request: Request, { params }: { params: { platform: string; username: string } }) {
  const parsed = paramsSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid platform or username." },
      { status: 400 },
    );
  }

  if (!isPlatformKey(parsed.data.platform)) {
    return NextResponse.json({ error: "Unsupported platform." }, { status: 400 });
  }

  const platform = parsed.data.platform;
  const username = getCacheKey(parsed.data.username);
  const cacheAgeMs = 5 * 60 * 1000;

  try {
    const cached = await getCachedPlatform<PlatformFetcherResult>(username, platform, cacheAgeMs);
    if (cached) {
      const cachedData = normalizePlatformData(platform, cached, username);
      const parsedCached = platformDataSchema.parse(cachedData);
      return NextResponse.json(parsedCached, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const raw = await fetcherMap[platform](username);
    await savePlatformCache(username, platform, raw);

    if (raw.status === "error") {
      const errorPayload = errorResponseSchema.parse({
        error: raw.error ?? "Failed to load stats.",
      });

      return NextResponse.json(errorPayload, {
        status: isCachedError(errorPayload.error) ? 404 : 502,
        headers: {
          "Cache-Control": "no-store",
        },
      });
    }

    const normalized = platformDataSchema.parse(normalizePlatformData(platform, raw, username));
    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(`[stats/${platform}/${username}]`, error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load stats.",
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
