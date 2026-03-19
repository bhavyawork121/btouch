import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 60;
const LIMIT = 60;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitRequest(identifier: string) {
  const key = `rate:${identifier}`;

  if (redis) {
    try {
      const requests = await redis.incr(key);
      if (requests === 1) {
        await redis.expire(key, WINDOW_SECONDS);
      }

      return {
        allowed: requests <= LIMIT,
        retryAfter: WINDOW_SECONDS,
      };
    } catch (error) {
      console.error("Rate limit fallback triggered", error);
    }
  }

  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfter: WINDOW_SECONDS };
  }

  entry.count += 1;
  memoryStore.set(key, entry);

  return {
    allowed: entry.count <= LIMIT,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}
