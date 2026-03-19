import { z } from "zod";
import type { CodeforcesStats } from "@/types/card";
import { fetchWithTimeout } from "./shared";

const schema = z.object({
  status: z.literal("OK"),
  result: z.array(
    z.object({
      handle: z.string(),
      rating: z.number().nullable(),
      maxRating: z.number().nullable(),
      rank: z.string().nullable(),
      maxRank: z.string().nullable(),
      contribution: z.number().nullable(),
      avatar: z.string().nullable().optional(),
      titlePhoto: z.string().nullable().optional(),
    }),
  ),
});

export async function fetchCodeforcesStats(handle: string): Promise<CodeforcesStats> {
  try {
    const response = await fetchWithTimeout(`https://codeforces.com/api/user.info?handles=${handle}`);
    const payload = schema.parse(await response.json());
    const user = payload.result[0];

    return {
      status: "ok",
      handle,
      rating: user.rating ?? 0,
      maxRating: user.maxRating ?? 0,
      rank: user.rank ?? "unrated",
      maxRank: user.maxRank ?? "unrated",
      contribution: user.contribution ?? 0,
      avatarUrl: user.titlePhoto ?? user.avatar ?? null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      handle,
      rating: 0,
      maxRating: 0,
      rank: "unrated",
      maxRank: "unrated",
      contribution: 0,
      avatarUrl: null,
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Codeforces fetch failed",
    };
  }
}
