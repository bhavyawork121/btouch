import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { PlatformKey } from "@/lib/platforms";

const TTL_MS: Record<PlatformKey | "linkedin", number> = {
  github: 86400 * 1000,
  leetcode: 21600 * 1000,
  codeforces: 21600 * 1000,
  gfg: 43200 * 1000,
  codechef: 43200 * 1000,
  linkedin: 604800 * 1000,
};

const CACHE_FIELD_MAP: Record<
  PlatformKey | "linkedin",
  { dataField: string; timeField: string }
> = {
  github: { dataField: "githubData", timeField: "githubCachedAt" },
  leetcode: { dataField: "leetcodeData", timeField: "leetcodeCachedAt" },
  codeforces: { dataField: "cfData", timeField: "cfCachedAt" },
  gfg: { dataField: "gfgData", timeField: "gfgCachedAt" },
  codechef: { dataField: "codechefData", timeField: "codechefCachedAt" },
  linkedin: { dataField: "linkedinData", timeField: "linkedinCachedAt" },
};

export async function getCachedPlatform<T>(
  username: string,
  platform: PlatformKey,
  maxAgeMs?: number,
): Promise<T | null> {
  const fields = CACHE_FIELD_MAP[platform];
  const card = await prisma.cardConfig.findUnique({
    where: { username },
    select: {
      [fields.dataField]: true,
      [fields.timeField]: true,
    } as never,
  });

  if (!card) {
    return null;
  }

  const data = (card as Record<string, unknown>)[fields.dataField] as T | null | undefined;
  const cachedAt = (card as Record<string, unknown>)[fields.timeField] as Date | string | null | undefined;

  if (!data || !cachedAt) {
    return null;
  }

  const age = Date.now() - new Date(cachedAt).getTime();
  const ttl = maxAgeMs ?? TTL_MS[platform];
  if (age > ttl) {
    return null;
  }

  return data;
}

export async function savePlatformCache<T>(username: string, platform: PlatformKey, data: T): Promise<void> {
  const fields = CACHE_FIELD_MAP[platform];
  await prisma.cardConfig.update({
    where: { username },
    data: {
      [fields.dataField]: data,
      [fields.timeField]: new Date(),
    } as never,
  });
}

export async function clearPlatformCache(username: string, platform: PlatformKey): Promise<void> {
  const fields = CACHE_FIELD_MAP[platform];
  await prisma.cardConfig.update({
    where: { username },
    data: {
      [fields.dataField]: Prisma.DbNull,
      [fields.timeField]: null,
    } as never,
  });
}

export async function clearAllCaches(username: string): Promise<void> {
  await prisma.cardConfig.update({
    where: { username },
    data: {
      githubData: Prisma.DbNull,
      githubCachedAt: null,
      leetcodeData: Prisma.DbNull,
      leetcodeCachedAt: null,
      cfData: Prisma.DbNull,
      cfCachedAt: null,
      gfgData: Prisma.DbNull,
      gfgCachedAt: null,
      codechefData: Prisma.DbNull,
      codechefCachedAt: null,
      linkedinData: Prisma.DbNull,
      linkedinCachedAt: null,
    },
  });
}

export const getFromCache = getCachedPlatform;
export const saveToCache = savePlatformCache;
export const clearCache = clearPlatformCache;
