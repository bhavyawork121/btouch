import type { CardData } from "@/types/card";

function buildHeatmap(seed: number) {
  return Array.from({ length: 91 }, (_, index) => ((index + seed) % 7 === 0 ? 4 : (index + seed) % 5 === 0 ? 2 : 0));
}

export function getDemoCardData(): CardData {
  const today = new Date().toISOString();

  return {
    appearance: {
      theme: "dark",
      accentColor: "indigo",
    },
    profile: {
      displayName: "Aarav Mehta",
      headline: "Full-stack engineer · product builder",
      bio: "Shipping developer tools, polished web experiences, and practical systems that feel fast.",
      avatarUrl: "",
      linkedinUrl: "https://www.linkedin.com/in/aarav-mehta",
      currentRole: "Staff Engineer",
      currentCompany: "Northstar Labs",
      location: "Bengaluru, India",
      skills: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "System Design"],
      openToWork: false,
      experience: [
        {
          role: "Staff Engineer",
          company: "Northstar Labs",
          duration: "2023 - Present",
          description: "Owns the front-end platform and developer experience layer.",
        },
        {
          role: "Senior Engineer",
          company: "Orbit Studio",
          duration: "2020 - 2023",
          description: "Built internal tooling and customer-facing product surfaces.",
        },
      ],
    },
    stats: {
      github: {
        status: "ok",
        handle: "aaravmehta",
        fetchedAt: today,
        followers: 1840,
        publicRepos: 64,
        stars: 521,
        contributionsLastYear: 1128,
        topLanguages: ["TypeScript", "Go", "Python"],
        heatmap: buildHeatmap(1),
        profileUrl: "https://github.com/aaravmehta",
        avatarUrl: "",
        bio: "Developer tooling and product engineering.",
      },
      leetcode: {
        status: "ok",
        handle: "aaravm",
        fetchedAt: today,
        solved: { easy: 182, medium: 141, hard: 37, total: 360 },
        ranking: 12456,
        acceptanceRate: 71.8,
        streak: 18,
        percentile: 93,
        badge: "Knight",
        avatarUrl: "",
      },
      codeforces: {
        status: "ok",
        handle: "aarav_mehta",
        fetchedAt: today,
        rating: 1712,
        maxRating: 1789,
        rank: "Specialist",
        maxRank: "Expert",
        contribution: 92,
        avatarUrl: "",
      },
      gfg: {
        status: "ok",
        handle: "aarav_mehta",
        fetchedAt: today,
        score: 386,
        streak: 12,
        solved: 248,
        instituteRank: "#14",
      },
    },
    config: {
      username: "demo",
      showPlatforms: ["github", "leetcode", "codeforces", "gfg"],
      theme: "dark",
      accentColor: "indigo",
    },
    meta: {
      lastRefreshed: today,
      stalePlatforms: [],
    },
  };
}
