import { z } from "zod";
import type { GitHubStats } from "@/types/card";
import { fetchWithTimeout } from "./shared";

const userSchema = z.object({
  avatar_url: z.string().url().nullable(),
  followers: z.number().int(),
  public_repos: z.number().int(),
  html_url: z.string().url(),
  bio: z.string().nullable(),
});

const graphSchema = z.object({
  data: z.object({
    user: z
      .object({
        repositories: z.object({
          nodes: z.array(
            z.object({
              stargazerCount: z.number().int(),
              primaryLanguage: z
                .object({
                  name: z.string(),
                  color: z.string().nullable(),
                })
                .nullable(),
            }),
          ),
        }),
        contributionsCollection: z.object({
          contributionCalendar: z.object({
            totalContributions: z.number().int(),
            weeks: z.array(
              z.object({
                contributionDays: z.array(
                  z.object({
                    contributionCount: z.number().int(),
                  }),
                ),
              }),
            ),
          }),
        }),
      })
      .nullable(),
  }),
});

const graphQuery = `
  query GitHubCard($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [profileResponse, graphResponse] = await Promise.allSettled([
      fetchWithTimeout(`https://api.github.com/users/${username}`, { headers }),
      process.env.GITHUB_TOKEN
        ? fetchWithTimeout("https://api.github.com/graphql", {
            method: "POST",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: graphQuery, variables: { login: username } }),
          })
        : Promise.resolve(null),
    ]);

    const profileJson = userSchema.parse(await (profileResponse.status === "fulfilled" ? profileResponse.value.json() : Promise.resolve({
      avatar_url: null,
      followers: 0,
      public_repos: 0,
      html_url: `https://github.com/${username}`,
      bio: null,
    })));

    let stars = 0;
    let topLanguages: string[] = [];
    let contributionsLastYear = 0;
    let heatmap = Array.from({ length: 56 }, () => 0);

    if (graphResponse.status === "fulfilled" && graphResponse.value) {
      const graphJson = graphSchema.parse(await graphResponse.value.json());
      const user = graphJson.data.user;

      if (user) {
        stars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);
        const languageCount = new Map<string, number>();
        for (const repo of user.repositories.nodes) {
          if (!repo.primaryLanguage) {
            continue;
          }
          languageCount.set(repo.primaryLanguage.name, (languageCount.get(repo.primaryLanguage.name) ?? 0) + 1);
        }
        topLanguages = [...languageCount.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([language]) => language);
        contributionsLastYear = user.contributionsCollection.contributionCalendar.totalContributions;
        heatmap = user.contributionsCollection.contributionCalendar.weeks
          .flatMap((week) => week.contributionDays.map((day) => Math.min(day.contributionCount, 4)))
          .slice(-56);
        if (heatmap.length < 56) {
          heatmap = [...Array.from({ length: 56 - heatmap.length }, () => 0), ...heatmap];
        }
      }
    }

    return {
      status: "ok",
      handle: username,
      followers: profileJson.followers,
      publicRepos: profileJson.public_repos,
      stars,
      contributionsLastYear,
      topLanguages,
      heatmap,
      profileUrl: profileJson.html_url,
      avatarUrl: profileJson.avatar_url,
      bio: profileJson.bio,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      handle: username,
      followers: 0,
      publicRepos: 0,
      stars: 0,
      contributionsLastYear: 0,
      topLanguages: [],
      heatmap: Array.from({ length: 56 }, () => 0),
      profileUrl: `https://github.com/${username}`,
      avatarUrl: null,
      bio: null,
      fetchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "GitHub fetch failed",
    };
  }
}
