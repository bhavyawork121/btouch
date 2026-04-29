"use client";

import { CardCase } from "@/components/card/CardCase";
import type { CardData } from "@/types/card";
import type { UserConfig } from "@/types/stats";

function mapLegacyCard(data: CardData): UserConfig {
  return {
    username: data.config.username || "preview",
    name: data.profile.displayName || data.config.username || "btouch",
    initials:
      (data.profile.displayName || data.config.username || "btouch")
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "BT",
    tagline: data.profile.headline || data.profile.currentRole || "",
    bio: data.profile.bio || "",
    avatarUrl: data.profile.avatarUrl || "",
    linkedinUrl: data.profile.linkedinUrl || "",
    linkedinVerified: false,
    portfolioUrl: "",
    skills: data.profile.skills || [],
    experience: (data.profile.experience || []).map((item) => ({
      role: item.role,
      company: item.company,
      period: item.duration || "",
      initial: item.company?.[0]?.toUpperCase() || "•",
    })),
    funZone: { type: "emoji", value: "🚀" },
    handles: {
      github: data.stats.github?.handle || "",
      leetcode: data.stats.leetcode?.handle || "",
      codeforces: data.stats.codeforces?.handle || "",
      gfg: data.stats.gfg?.handle || "",
    },
  };
}

interface FlipCardProps {
  data: CardData;
  username?: string;
  initialViewMode?: "compact" | "full";
  initialOpen?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
  onShare?: () => void;
  onRefresh?: () => void;
  emptyStateHref?: string;
  isOwner?: boolean;
  className?: string;
}

export function FlipCard({ data, className, initialOpen = false }: FlipCardProps) {
  return (
    <div className={className}>
      <CardCase config={mapLegacyCard(data)} initialOpen={initialOpen} />
    </div>
  );
}
