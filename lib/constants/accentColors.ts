export type AccentSwatchKey =
  | "neutral-0"
  | "neutral-1"
  | "neutral-2"
  | "neutral-3"
  | "brand-0"
  | "brand-1"
  | "brand-2"
  | "brand-3"
  | "platform-0"
  | "platform-1"
  | "platform-2"
  | "platform-3"
  | "platform-4"
  | "platform-5"
  | "platform-6"
  | "platform-7";

export interface AccentSwatch {
  key: AccentSwatchKey;
  name: string;
  group: "Neutral" | "Brand" | "Platform";
  hex: string;
  rgb: string;
}

export const accentSwatches: AccentSwatch[] = [
  { key: "neutral-0", name: "Graphite", group: "Neutral", hex: "#343845", rgb: "52 56 69" },
  { key: "neutral-1", name: "Slate", group: "Neutral", hex: "#475569", rgb: "71 85 105" },
  { key: "neutral-2", name: "Steel", group: "Neutral", hex: "#64748b", rgb: "100 116 139" },
  { key: "neutral-3", name: "Pearl", group: "Neutral", hex: "#94a3b8", rgb: "148 163 184" },
  { key: "brand-0", name: "Indigo", group: "Brand", hex: "#6366f1", rgb: "99 102 241" },
  { key: "brand-1", name: "Violet", group: "Brand", hex: "#7c3aed", rgb: "124 58 237" },
  { key: "brand-2", name: "Cyan", group: "Brand", hex: "#06b6d4", rgb: "6 182 212" },
  { key: "brand-3", name: "Emerald", group: "Brand", hex: "#10b981", rgb: "16 185 129" },
  { key: "platform-0", name: "GitHub", group: "Platform", hex: "#9a6ee3", rgb: "154 110 227" },
  { key: "platform-1", name: "LinkedIn", group: "Platform", hex: "#0a66c2", rgb: "10 102 194" },
  { key: "platform-2", name: "LeetCode", group: "Platform", hex: "#f89f1b", rgb: "248 159 27" },
  { key: "platform-3", name: "Codeforces", group: "Platform", hex: "#3466b7", rgb: "52 102 183" },
  { key: "platform-4", name: "GFG", group: "Platform", hex: "#2f8d46", rgb: "47 141 70" },
  { key: "platform-5", name: "Rose", group: "Platform", hex: "#e11d48", rgb: "225 29 72" },
  { key: "platform-6", name: "Amber", group: "Platform", hex: "#f59e0b", rgb: "245 158 11" },
  { key: "platform-7", name: "Sky", group: "Platform", hex: "#38bdf8", rgb: "56 189 248" },
];

export const accentSwatchGroups: Array<{
  title: "Neutral" | "Brand" | "Platform";
  items: AccentSwatch[];
}> = [
  { title: "Neutral", items: accentSwatches.filter((swatch) => swatch.group === "Neutral") },
  { title: "Brand", items: accentSwatches.filter((swatch) => swatch.group === "Brand") },
  { title: "Platform", items: accentSwatches.filter((swatch) => swatch.group === "Platform") },
];

export function getAccentByHex(hex: string) {
  return accentSwatches.find((swatch) => swatch.hex.toLowerCase() === hex.toLowerCase()) ?? accentSwatches[0];
}

export function getAccentByName(name: string) {
  return accentSwatches.find((swatch) => swatch.name.toLowerCase() === name.toLowerCase()) ?? accentSwatches[0];
}
