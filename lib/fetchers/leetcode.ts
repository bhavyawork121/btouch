import { z } from "zod";
import type { LeetCodeStats } from "@/types/card";
import { fetchWithTimeout } from "./shared";

const schema = z.object({
  data: z.object({
    matchedUser: z
      .object({
        profile: z.object({
          ranking: z.number().nullable(),
          userAvatar: z.string().nullable(),
          realName: z.string().nullable(),
          aboutMe: z.string().nullable(),
        }),
        submitStatsGlobal: z.object({
          acSubmissionNum: z.array(
            z.object({
              difficulty: z.string(),
              count: z.number(),
            }),
          ),
        }),
      })
      .nullable(),
    userContestRanking: z
      .object({
        topPercentage: z.number().nullable(),
      })
      .nullable(),
  }),
});

const query = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      profile {
        ranking
        userAvatar
        realName
        aboutMe
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      topPercentage
    }
  }
`;

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  try {
    const response = await fetchWithTimeout(
      "https://leetcode.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
      },
      8000,
    );

    const payload = schema.parse(await response.json());
    const user = payload.data.matchedUser;
    const solvedMap = new Map<string, number>();

    for (const item of user?.submitStatsGlobal.acSubmissionNum ?? []) {
      solvedMap.set(item.difficulty.toLowerCase(), item.count);
    }

    const easy = solvedMap.get("easy") ?? 0;
    const medium = solvedMap.get("medium") ?? 0;
    const hard = solvedMap.get("hard") ?? 0;
    const total = easy + medium + hard;
    const topPercentage = payload.data.userContestRanking?.topPercentage ?? null;
    const acceptanceRate = total > 0 ? Math.min(100, Math.round((medium + hard * 1.4) / total * 100)) : null;
    const badge = topPercentage !== null && topPercentage <= 5 ? "gold" : topPercentage !== null && topPercentage <= 15 ? "silver" : topPercentage !== null && topPercentage <= 30 ? "bronze" : null;

    return {
      status: user ? "ok" : "error",
      handle: username,
      solved: { easy, medium, hard, total },
      ranking: user?.profile.ranking ?? null,
      acceptanceRate,
      streak: null,
      percentile: topPercentage !== null ? Math.max(0, 100 - topPercentage) : null,
      badge,
      avatarUrl: user?.profile.userAvatar ?? null,
      fetchedAt: new Date().toISOString(),
      error: user ? undefined : "LeetCode user not found",
    };
  } catch (error) {
    return {
      status: "error",
      handle: username,
      solved: { easy: 0, medium: 0, hard: 0, total: 0 },
      ranking: null,
      acceptanceRate: null,
      streak: null,
      percentile: null,
      badge: null,
      avatarUrl: null,
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "LeetCode fetch failed",
    };
  }
}
