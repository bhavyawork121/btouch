export type PlatformStatus = "ok" | "stale" | "error";
export type PlatformName = "github" | "leetcode" | "codeforces" | "gfg" | "codechef";
export type CardTheme = "dark" | "light" | "auto";

interface PlatformStatsBase {
  status: PlatformStatus;
  handle: string;
  fetchedAt: string;
  error?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  duration: string | null;
  description: string | null;
}

export interface GitHubStats extends PlatformStatsBase {
  followers: number;
  publicRepos: number;
  stars: number;
  contributionsLastYear: number;
  topLanguages: string[];
  heatmap: number[];
  profileUrl: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface LeetCodeStats extends PlatformStatsBase {
  solved: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  ranking: number | null;
  acceptanceRate: number | null;
  streak: number | null;
  percentile: number | null;
  badge: string | null;
  avatarUrl: string | null;
}

export interface CodeforcesStats extends PlatformStatsBase {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  avatarUrl: string | null;
}

export interface GFGStats extends PlatformStatsBase {
  score: number;
  streak: number;
  solved: number;
  instituteRank: string;
  dataUnavailable?: boolean;
}

export interface CodeChefStats extends PlatformStatsBase {
  rating: number | null;
  globalRank: string | null;
  stars: number | null;
  profileUrl: string;
}

export interface CardData {
  appearance: {
    theme: CardTheme;
    accentColor: string;
  };
  profile: {
    displayName: string | null;
    headline: string | null;
    bio: string | null;
    avatarUrl: string | null;
    linkedinUrl: string | null;
    currentRole: string | null;
    currentCompany: string | null;
    location?: string | null;
    skills?: string[];
    openToWork?: boolean;
    experience?: ExperienceEntry[];
  };
  stats: {
    github: GitHubStats | null;
    leetcode: LeetCodeStats | null;
    codeforces: CodeforcesStats | null;
    gfg: GFGStats | null;
    codechef: CodeChefStats | null;
  };
  config: {
    showPlatforms: PlatformName[];
    theme: CardTheme;
    accentColor: string;
    username: string;
  };
  meta: {
    lastRefreshed: string;
    stalePlatforms: PlatformName[];
  };
}

export type CardStats = CardData["stats"];

export interface PlatformStatSummary {
  platform: PlatformName;
  status: PlatformStatus;
  label: string;
  value: string;
  detail: string;
}
