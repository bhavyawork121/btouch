export interface OgExperienceEntry {
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  logoUrl: string | null;
  domain: string | null;
}

const BACKGROUND_PRESETS: Record<string, string> = {
  "gradient-aurora": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "gradient-ocean": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "gradient-sunset": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "gradient-forest": "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "gradient-midnight": "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "gradient-gold": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
};

function asText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function truncateText(value: string | null | undefined, maxLength = 80) {
  const text = asText(value);
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "BT";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function resolveCardBackground(background?: string | null) {
  if (!background) {
    return BACKGROUND_PRESETS["gradient-aurora"];
  }

  if (background in BACKGROUND_PRESETS) {
    return BACKGROUND_PRESETS[background];
  }

  if (background.startsWith("custom:")) {
    const colors = background.slice("custom:".length).split(",").map((color) => color.trim());
    if (colors.length >= 2 && colors[0] && colors[1]) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
    }
  }

  return BACKGROUND_PRESETS["gradient-aurora"];
}

export function stripLinkedInHandle(url: string) {
  return url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "");
}

export function formatDateRange(startDate?: string | null, endDate?: string | null) {
  const start = asText(startDate);
  const end = asText(endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start ?? end ?? "Present";
}

export function normalizeOgExperience(value: unknown): OgExperienceEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const mapped = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const item = entry as Record<string, unknown>;
      const role = asText(item.role);
      const company = asText(item.company);

      if (!role || !company) {
        return null;
      }

      return {
        company,
        role,
        startDate: asText(item.startDate),
        endDate: asText(item.endDate) ?? asText(item.duration),
        description: asText(item.description),
        logoUrl: asText(item.logoUrl),
        domain: asText(item.domain),
      };
    })
    .filter((entry): entry is OgExperienceEntry => entry !== null);

  return mapped;
}
