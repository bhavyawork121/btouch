import { load } from "cheerio";
import { fetchWithTimeout } from "@/lib/fetchers/shared";

export type CodeChefStatus = "ok" | "stale" | "error";

export interface CodeChefStats {
  status: CodeChefStatus;
  handle: string;
  rating: number | null;
  globalRank: string | null;
  stars: number | null;
  profileUrl: string;
  fetchedAt: string;
  error?: string;
}

interface CacheEntry {
  expiresAt: number;
  value: CodeChefStats;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const inMemoryCache = new Map<string, CacheEntry>();

function getCachedValue(handle: string) {
  const cached = inMemoryCache.get(handle.toLowerCase());
  if (!cached || cached.expiresAt < Date.now()) {
    if (cached) {
      inMemoryCache.delete(handle.toLowerCase());
    }
    return null;
  }

  return cached.value;
}

function setCachedValue(handle: string, value: CodeChefStats) {
  inMemoryCache.set(handle.toLowerCase(), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  });
}

function normalizeHandle(handle: string) {
  return handle.trim().toLowerCase();
}

function findFirstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractNumericValue(text: string) {
  const match = text.match(/(\d[\d,]*)/);
  if (!match?.[1]) {
    return null;
  }

  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

function extractStars(text: string) {
  const stars = text.match(/[★☆⭐]/g);
  return stars ? stars.length : null;
}

function readJsonLd(text: string) {
  const scripts = [...text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const values: unknown[] = [];

  for (const script of scripts) {
    const content = script[1]?.trim();
    if (!content) {
      continue;
    }

    try {
      values.push(JSON.parse(content));
    } catch {
      continue;
    }
  }

  return values;
}

function findValueByKey(input: unknown, keyNames: string[]): string | number | null {
  if (Array.isArray(input)) {
    for (const item of input) {
      const value = findValueByKey(item, keyNames);
      if (value !== null) {
        return value;
      }
    }
    return null;
  }

  if (!input || typeof input !== "object") {
    return null;
  }

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (keyNames.includes(key.toLowerCase())) {
      if (typeof value === "string" || typeof value === "number") {
        return value;
      }
      if (value && typeof value === "object" && "value" in value) {
        const nested = (value as Record<string, unknown>).value;
        if (typeof nested === "string" || typeof nested === "number") {
          return nested;
        }
      }
    }

    const nested = findValueByKey(value, keyNames);
    if (nested !== null) {
      return nested;
    }
  }

  return null;
}

function parseCodeChefPayload(html: string, handle: string): CodeChefStats {
  const $ = load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const pageText = `${bodyText} ${html}`.replace(/\s+/g, " ");

  const jsonLdValues = readJsonLd(html);
  const ratingFromJson = findValueByKey(jsonLdValues, ["rating", "ratingvalue", "score"]);
  const rankFromJson = findValueByKey(jsonLdValues, ["globalrank", "rank"]);
  const starsFromJson = findValueByKey(jsonLdValues, ["stars", "starrating", "starcount"]);

  const ratingText =
    findFirstMatch(pageText, [
      /(?:current\s*)?rating[^0-9]{0,24}(\d{3,4})/i,
      /rating["' ]*[:=]["' ]*(\d{3,4})/i,
      /"ratingValue"\s*:\s*"?(\d{3,4})"?/i,
    ]) ?? (typeof ratingFromJson === "number" ? String(ratingFromJson) : typeof ratingFromJson === "string" ? ratingFromJson : null);

  const rankText =
    findFirstMatch(pageText, [
      /global\s*rank[^#0-9]{0,24}(#?\s?[\d,]+)/i,
      /rank[^#0-9]{0,24}(#?\s?[\d,]+)/i,
    ]) ?? (typeof rankFromJson === "number" ? `#${rankFromJson.toLocaleString("en-IN")}` : typeof rankFromJson === "string" ? rankFromJson : null);

  const starsText =
    (typeof starsFromJson === "number" ? starsFromJson : typeof starsFromJson === "string" ? Number(starsFromJson) : null) ??
    extractStars(pageText);

  const rating = ratingText ? extractNumericValue(ratingText) : null;
  const globalRank = rankText ? `#${rankText.replace(/^#\s*/, "").replace(/\s+/g, " ")}` : null;
  const stars = typeof starsText === "number" && Number.isFinite(starsText) ? starsText : null;

  const hasUsefulData = rating !== null || globalRank !== null || stars !== null;

  return {
    status: hasUsefulData ? "ok" : "error",
    handle,
    rating,
    globalRank,
    stars,
    profileUrl: `https://www.codechef.com/users/${handle}`,
    fetchedAt: new Date().toISOString(),
    error: hasUsefulData ? undefined : "CodeChef profile data could not be parsed.",
  };
}

export async function fetchCodeChefStats(username: string): Promise<CodeChefStats> {
  const handle = normalizeHandle(username);
  const cached = getCachedValue(handle);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetchWithTimeout(`https://www.codechef.com/users/${encodeURIComponent(handle)}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await response.text();
    const parsed = parseCodeChefPayload(html, handle);
    setCachedValue(handle, parsed);
    return parsed;
  } catch (error) {
    const fallback: CodeChefStats = {
      status: "error",
      handle,
      rating: null,
      globalRank: null,
      stars: null,
      profileUrl: `https://www.codechef.com/users/${handle}`,
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "CodeChef fetch failed",
    };

    setCachedValue(handle, fallback);
    return fallback;
  }
}
