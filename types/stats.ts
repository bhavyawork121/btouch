export interface WorkEntry {
  role: string;
  company: string;
  period: string;
  initial: string;
}

export interface UserConfig {
  username: string;
  name: string;
  initials: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  linkedinUrl: string;
  linkedinVerified: boolean;
  portfolioUrl: string;
  skills: string[];
  experience: WorkEntry[];
  funZone: { type: "emoji" | "quote" | "custom"; value: string };
  handles: {
    github: string;
    leetcode: string;
    codeforces: string;
    gfg: string;
  };
}

export interface LanguageShare {
  label: string;
  percent: number;
}

export interface GitHubStats {
  stars: number;
  contributions: number;
  topLanguage: string;
  repos: number;
  weeklyActivity: number[];
  languageBreakdown: LanguageShare[];
}

export interface LeetCodeStats {
  solved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  globalRank: number;
  weeklyActivity: number[];
}

export interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  contribution: number;
  weeklyActivity: number[];
}

export interface GFGStats {
  score: number;
  problemsSolved: number;
  currentStreak: number;
  weeklyActivity: number[];
}

export interface WeeklyActivity {
  platform: "github" | "leetcode" | "codeforces" | "gfg";
  color: string;
  abbr: string;
  days: number[];
}

export interface PlatformStats {
  github: GitHubStats | null;
  leetcode: LeetCodeStats | null;
  codeforces: CodeforcesStats | null;
  gfg: GFGStats | null;
  devScore: number;
  percentile: string;
  lastUpdated: string;
  activity: WeeklyActivity[];
}
