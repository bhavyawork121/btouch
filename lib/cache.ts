import { Redis } from "@upstash/redis";
import type { PlatformName } from "@/types/card";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const platformTtl: Record<PlatformName | "linkedin", number> = {
  github: 86400,
  leetcode: 21600,
  codeforces: 21600,
  gfg: 43200,
  linkedin: 604800,
};

export function cacheKey(username: string, platform: PlatformName | "linkedin") {
  return `card:${username}:${platform}`;
}

export async function getCachedJson<T>(key: string) {
  if (!redis) {
    return null;
  }

  try {
    return (await redis.get<T>(key)) ?? null;
  } catch (error) {
    console.error("Redis read failed", error);
    return null;
  }
}

export async function setCachedJson<T>(key: string, value: T, ttlSeconds: number) {
  if (!redis) {
    return;
  }

  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Redis write failed", error);
  }
}

export async function clearCardCache(username: string) {
  if (!redis) {
    return;
  }

  const keys = [
    cacheKey(username, "github"),
    cacheKey(username, "leetcode"),
    cacheKey(username, "codeforces"),
    cacheKey(username, "gfg"),
    cacheKey(username, "linkedin"),
  ];

  try {
    await redis.del(...keys);
  } catch (error) {
    console.error("Redis delete failed", error);
  }
}

export async function clearPlatformCache(username: string, platform: PlatformName | "linkedin") {
  if (!redis) {
    return;
  }

  try {
    await redis.del(cacheKey(username, platform));
  } catch (error) {
    console.error("Redis delete failed", error);
  }
}
