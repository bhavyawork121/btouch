import type { CardTheme } from "@/types/card";

export const accentOptions = [
  "indigo",
  "blue",
  "cyan",
  "emerald",
  "green",
  "amber",
  "orange",
  "rose",
  "pink",
  "violet",
  "purple",
  "github",
  "leetcode",
  "codeforces",
  "gfg",
  "linkedin",
] as const;

export type AccentOption = (typeof accentOptions)[number];

const accentPalette: Record<string, { hex: string; rgb: string }> = {
  indigo: { hex: "#6366f1", rgb: "99 102 241" },
  blue: { hex: "#3466b7", rgb: "52 102 183" },
  cyan: { hex: "#0891b2", rgb: "8 145 178" },
  emerald: { hex: "#059669", rgb: "5 150 105" },
  green: { hex: "#2f8d46", rgb: "47 141 70" },
  amber: { hex: "#f59e0b", rgb: "245 158 11" },
  orange: { hex: "#ea580c", rgb: "234 88 12" },
  rose: { hex: "#e11d48", rgb: "225 29 72" },
  pink: { hex: "#db2777", rgb: "219 39 119" },
  violet: { hex: "#7c3aed", rgb: "124 58 237" },
  purple: { hex: "#9a6ee3", rgb: "154 110 227" },
  github: { hex: "#9a6ee3", rgb: "154 110 227" },
  leetcode: { hex: "#f89f1b", rgb: "248 159 27" },
  codeforces: { hex: "#3466b7", rgb: "52 102 183" },
  gfg: { hex: "#2f8d46", rgb: "47 141 70" },
  linkedin: { hex: "#0A66C2", rgb: "10 102 194" },
};

export function resolveAccent(accentColor: string) {
  return accentPalette[accentColor.toLowerCase()] ?? accentPalette.indigo;
}

export function resolveTheme(theme: CardTheme, prefersDark: boolean) {
  if (theme === "auto") {
    return prefersDark ? "dark" : "light";
  }

  return theme;
}

export function getThemeSurface(theme: "dark" | "light") {
  if (theme === "light") {
    return {
      background:
        "radial-gradient(circle at top left, rgba(52, 102, 183, 0.12), transparent 30%), radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 24%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 48%, #e5edf8 100%)",
      foreground: "#0f172a",
      muted: "rgba(51, 65, 85, 0.78)",
      panel: "rgba(255,255,255,0.72)",
      border: "rgba(15,23,42,0.08)",
    };
  }

  return {
    background:
      "radial-gradient(circle at top left, rgba(52, 102, 183, 0.22), transparent 28%), radial-gradient(circle at top right, rgba(154, 110, 227, 0.2), transparent 24%), linear-gradient(180deg, #06080d 0%, #0e1117 45%, #111723 100%)",
    foreground: "#f5f7fb",
    muted: "rgba(226, 232, 240, 0.7)",
    panel: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.10)",
  };
}
