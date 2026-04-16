export const PLATFORM_KEYS = ["github", "leetcode", "gfg", "codeforces", "codechef"] as const;

export type PlatformKey = (typeof PLATFORM_KEYS)[number];

export interface PlatformConfig {
  key: PlatformKey;
  label: string;
  initials: string;
  color: string;
  handleHint: string;
  profileUrl: (username: string) => string;
  iconLabel: string;
}

const PLATFORM_CONFIGS: Record<PlatformKey, PlatformConfig> = {
  github: {
    key: "github",
    label: "GitHub",
    initials: "GH",
    color: "#6e40c9",
    handleHint: "Your GitHub username, e.g. torvalds",
    profileUrl: (username) => `https://github.com/${username}`,
    iconLabel: "GitHub octocat",
  },
  leetcode: {
    key: "leetcode",
    label: "LeetCode",
    initials: "LC",
    color: "#ffa116",
    handleHint: "Your LeetCode username",
    profileUrl: (username) => `https://leetcode.com/u/${username}`,
    iconLabel: "LeetCode logo",
  },
  gfg: {
    key: "gfg",
    label: "GeeksforGeeks",
    initials: "GFG",
    color: "#2f8d46",
    handleHint: "Your GFG username (from your profile URL)",
    profileUrl: (username) => `https://www.geeksforgeeks.org/user/${username}/`,
    iconLabel: "GeeksforGeeks logo",
  },
  codeforces: {
    key: "codeforces",
    label: "Codeforces",
    initials: "CF",
    color: "#1890ff",
    handleHint: "Your Codeforces handle",
    profileUrl: (username) => `https://codeforces.com/profile/${username}`,
    iconLabel: "Codeforces logo",
  },
  codechef: {
    key: "codechef",
    label: "CodeChef",
    initials: "CC",
    color: "#5b4638",
    handleHint: "Your CodeChef username",
    profileUrl: (username) => `https://www.codechef.com/users/${username}`,
    iconLabel: "CodeChef logo",
  },
};

export const platformOrder: PlatformKey[] = [...PLATFORM_KEYS];

export function isPlatformKey(value: string): value is PlatformKey {
  return (PLATFORM_KEYS as readonly string[]).includes(value);
}

export function getPlatformConfig(platform: PlatformKey): PlatformConfig {
  return PLATFORM_CONFIGS[platform];
}

export function getPlatformConfigs(platforms: readonly string[] | undefined | null): PlatformConfig[] {
  if (!platforms) {
    return [];
  }

  return platforms.filter(isPlatformKey).map((platform) => PLATFORM_CONFIGS[platform]);
}

export function getPlatformLabel(platform: PlatformKey) {
  return PLATFORM_CONFIGS[platform].label;
}

export function getPlatformColor(platform: PlatformKey) {
  return PLATFORM_CONFIGS[platform].color;
}

export function getPlatformHandleHint(platform: PlatformKey) {
  return PLATFORM_CONFIGS[platform].handleHint;
}

export function getPlatformProfileUrl(platform: PlatformKey, username: string) {
  return PLATFORM_CONFIGS[platform].profileUrl(username.trim());
}

