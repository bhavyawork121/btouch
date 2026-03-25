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
      displayName: "Bhavya Agarwal",
      headline: "Developer builder · product engineer",
      bio: "Building polished web experiences and practical systems that feel fast.",
      avatarUrl: "",
      linkedinUrl: "https://www.linkedin.com/in/bhavya-agarwal-5a446b366/",
      currentRole: "Product Engineer",
      currentCompany: "btouch",
      location: "India",
      skills: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "UI Systems"],
      openToWork: false,
      experience: [
        {
          role: "Product Engineer",
          company: "btouch",
          duration: "2024 - Present",
          description: "Working on developer identity cards and profile experiences.",
        },
        {
          role: "Frontend Engineer",
          company: "Independent",
          duration: "2022 - 2024",
          description: "Built polished product surfaces and interactive web apps.",
        },
      ],
    },
    stats: {
      github: {
        status: "ok",
        handle: "bhavyaagarwal",
        fetchedAt: today,
        followers: 184,
        publicRepos: 24,
        stars: 51,
        contributionsLastYear: 228,
        topLanguages: ["TypeScript", "React", "CSS"],
        heatmap: buildHeatmap(1),
        profileUrl: "https://github.com/bhavyaagarwal",
        avatarUrl: "",
        bio: "Developer tooling and product engineering.",
      },
      leetcode: {
        status: "ok",
        handle: "bhavyaagarwal",
        fetchedAt: today,
        solved: { easy: 82, medium: 61, hard: 17, total: 160 },
        ranking: 42456,
        acceptanceRate: 67.8,
        streak: 8,
        percentile: 73,
        badge: "Knight",
        avatarUrl: "",
      },
      codeforces: {
        status: "ok",
        handle: "bhavyaagarwal",
        fetchedAt: today,
        rating: 1312,
        maxRating: 1489,
        rank: "Pupil",
        maxRank: "Specialist",
        contribution: 42,
        avatarUrl: "",
      },
      gfg: {
        status: "ok",
        handle: "bhavyaagarwal",
        fetchedAt: today,
        score: 186,
        streak: 6,
        solved: 148,
        instituteRank: "#24",
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
