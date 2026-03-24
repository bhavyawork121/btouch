export const homeCopy = {
  badge: "Public developer cards with live platform stats",
  headline: "One card.\nTwo faces.\nAll of your developer identity.",
  sub: "btouch turns your LinkedIn presence and coding platform history into an animated flip card that feels built, not generated.",
  cta1: "Build your card",
  cta2: "View live example",
  features: [
    {
      icon: "linkedin",
      title: "LinkedIn front",
      desc: "Profile identity tuned for first impression.",
    },
    {
      icon: "github",
      title: "Live coding stats",
      desc: "GitHub, LeetCode, Codeforces, and GFG in one view.",
    },
    {
      icon: "share",
      title: "Shareable URL",
      desc: "Optimized SSR card pages and QR export for sharing.",
    },
  ],
} as const;

export const dashboardCopy = {
  saveSuccess: "Card saved successfully",
  saveError: "Failed to save. Please try again.",
  refreshing: "Refreshing platform data...",
  refreshDone: "Stats updated",
  platformHint: "We fetch your stats automatically once connected",
  emptyCard: "Your card is empty — add your details to get started",
} as const;

export const publicCopy = {
  loading: "Refreshing live stats...",
  ready: "Shareable profile with live platform data.",
  refreshFailed: "Live refresh failed. Showing the last available card data.",
  stalePrefix: "Some platforms are stale or unavailable:",
  retryFailed: (platform: string) => `Retry failed for ${platform}.`,
} as const;
