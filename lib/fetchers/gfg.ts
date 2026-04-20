import { load } from "cheerio";
import { z } from "zod";
import type { GFGStats } from "@/types/card";
import { fetchWithTimeout } from "./shared";

const communitySchema = z.object({
  info: z
    .object({
      userName: z.string().optional(),
      instituteRank: z.union([z.string(), z.number()]).optional(),
      currentStreak: z.union([z.string(), z.number()]).optional(),
      codingScore: z.union([z.string(), z.number()]).optional(),
      totalProblemsSolved: z.union([z.string(), z.number()]).optional(),
    })
    .passthrough(),
});

function toNumber(value: string | number | undefined) {
  if (typeof value === "number") {
    return value;
  }
  const numeric = Number((value ?? "0").toString().replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildFailure(username: string, error: string): GFGStats {
  return {
    status: "error",
    handle: username,
    score: 0,
    streak: 0,
    solved: 0,
    instituteRank: "NA",
    fetchedAt: new Date().toISOString(),
    error,
    dataUnavailable: true,
  };
}

export async function fetchGfgStats(username: string): Promise<GFGStats> {
  try {
    const communityResponse = await fetchWithTimeout(
      `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${username}`,
    );
    const communityPayload = communitySchema.parse(await communityResponse.json());

    return {
      status: "ok",
      handle: username,
      score: toNumber(communityPayload.info.codingScore),
      streak: toNumber(communityPayload.info.currentStreak),
      solved: toNumber(communityPayload.info.totalProblemsSolved),
      instituteRank: String(communityPayload.info.instituteRank ?? "NA"),
      fetchedAt: new Date().toISOString(),
    };
  } catch (communityError) {
    try {
      const response = await fetchWithTimeout(`https://www.geeksforgeeks.org/${username}/`);
      const html = await response.text();
      const $ = load(html);
      const stats = $(".score_card_value").map((_, element) => $(element).text().trim()).get();

      if (stats.length === 0 || stats.every((value) => value.length === 0)) {
        return buildFailure(
          username,
          communityError instanceof Error ? communityError.message : "Community API unavailable",
        );
      }

      return {
        status: "stale",
        handle: username,
        score: toNumber(stats[0]),
        streak: toNumber(stats[1]),
        solved: toNumber(stats[2]),
        instituteRank: stats[3] ?? "NA",
        fetchedAt: new Date().toISOString(),
        error: communityError instanceof Error ? communityError.message : "Community API unavailable",
      };
    } catch (error) {
      return buildFailure(username, error instanceof Error ? error.message : "GFG fetch failed");
    }
  }
}
