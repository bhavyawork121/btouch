"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Link2, Share2, Sparkles } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { toast } from "sonner";
import { ParticleBackground } from "@/components/card/ParticleBackground";
import type { CardData } from "@/types/card";

export interface CardFrontWorkExperience {
  company: string;
  role: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  domain?: string | null;
}

interface CardFrontProps {
  data?: CardData;
  username?: string;
  displayName?: string;
  tagline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  workExperience?: CardFrontWorkExperience[];
  cardBackground?: string;
  cardFont?: string;
  particleEnabled?: boolean;
  isOwner?: boolean;
  onShare?: () => void;
  className?: string;
}

const BACKGROUND_PRESETS: Record<string, string> = {
  "gradient-aurora": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "gradient-ocean": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "gradient-sunset": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "gradient-forest": "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "gradient-midnight": "linear-gradient(135deg, #232526 0%, #414345 100%)",
  "gradient-gold": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
};

function parseBackground(background = "gradient-aurora") {
  if (background in BACKGROUND_PRESETS) {
    return BACKGROUND_PRESETS[background];
  }

  if (background.startsWith("custom:")) {
    const [, colors] = background.split("custom:");
    const [start, end] = (colors ?? "").split(",").map((part) => part.trim());

    if (start && end) {
      return `linear-gradient(135deg, ${start}, ${end})`;
    }
  }

  return BACKGROUND_PRESETS["gradient-aurora"];
}

function getFontFamily(font = "inter") {
  switch (font) {
    case "space-grotesk":
      return "var(--font-space-grotesk), sans-serif";
    case "cal-sans":
      return '"Cal Sans", var(--font-space-grotesk), sans-serif';
    case "inter":
    default:
      return "var(--font-inter), var(--font-space-grotesk), sans-serif";
  }
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "BT";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateRange(startDate?: string | null, endDate?: string | null) {
  const start = startDate?.trim();
  const end = endDate?.trim();

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start ?? end ?? "Present";
}

function fromLegacyExperience(data: CardData["profile"]["experience"]): CardFrontWorkExperience[] {
  return (data ?? []).map((entry) => ({
    company: entry.company,
    role: entry.role,
    startDate: null,
    endDate: entry.duration,
    description: entry.description,
  }));
}

function stripLinkedInHandle(linkedinUrl: string) {
  return linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "");
}

function CompanyLogo({
  company,
  logoUrl,
  domain,
}: {
  company: string;
  logoUrl?: string | null;
  domain?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const normalizedDomain = domain?.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  const clearbitUrl = normalizedDomain ? `https://logo.clearbit.com/${normalizedDomain}` : null;
  const imageUrl = failed ? null : logoUrl ?? clearbitUrl;

  if (!imageUrl) {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px] font-semibold text-white/70">
        {company.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${company} logo`}
      width={24}
      height={24}
      className="h-6 w-6 rounded-md object-cover"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

function ExperienceCard({ item }: { item: CardFrontWorkExperience }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <CompanyLogo company={item.company} logoUrl={item.logoUrl} domain={item.domain} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{item.role}</p>
              <p className="truncate text-[11px] text-white/65">
                {item.company} • {formatDateRange(item.startDate, item.endDate)}
              </p>
            </div>
          </div>
          {item.description ? (
            <p
              className="mt-2 text-[11px] leading-5 text-white/55"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CardFront({
  data,
  username,
  displayName,
  tagline,
  bio,
  avatarUrl,
  linkedinUrl,
  workExperience = [],
  cardBackground = "gradient-aurora",
  cardFont = "inter",
  particleEnabled = false,
  isOwner = false,
  onShare,
  className,
}: CardFrontProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const resolvedUsername = username ?? data?.config.username ?? "btouch";
  const resolvedDisplayName = displayName ?? data?.profile.displayName ?? resolvedUsername;
  const resolvedTagline = tagline ?? data?.profile.headline ?? null;
  const resolvedBio = bio ?? data?.profile.bio ?? null;
  const resolvedAvatar = avatarUrl ?? data?.profile.avatarUrl ?? null;
  const resolvedLinkedInUrl = linkedinUrl ?? data?.profile.linkedinUrl ?? null;
  const resolvedWorkExperience = workExperience.length > 0 ? workExperience : fromLegacyExperience(data?.profile.experience);
  const resolvedBackground = cardBackground ?? "gradient-aurora";
  const resolvedFont = cardFont ?? "inter";
  const resolvedParticleEnabled = Boolean(particleEnabled);
  const backgroundImage = useMemo(() => parseBackground(resolvedBackground), [resolvedBackground]);
  const fontFamily = useMemo(() => getFontFamily(resolvedFont), [resolvedFont]);
  const visibleExperience = useMemo(() => resolvedWorkExperience.slice(0, 2), [resolvedWorkExperience]);
  const initials = useMemo(() => getInitials(resolvedDisplayName || resolvedUsername), [resolvedDisplayName, resolvedUsername]);
  const linkedInHandle = resolvedLinkedInUrl ? stripLinkedInHandle(resolvedLinkedInUrl) : null;

  async function handleCopyLinkedIn() {
    if (!resolvedLinkedInUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedLinkedInUrl);
      toast.success("LinkedIn copied!");
    } catch {
      toast.error("Could not copy LinkedIn link.");
    }
  }

  return (
    <article
      className={[
        "relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
        className ?? "",
      ].join(" ")}
      style={{ backgroundImage, fontFamily } as CSSProperties}
      aria-label={`${resolvedDisplayName}'s developer card front`}
    >
      <ParticleBackground enabled={resolvedParticleEnabled} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-5 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            btouch
          </div>
          {resolvedLinkedInUrl ? (
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              LinkedIn verified
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="group relative h-24 w-24 overflow-hidden rounded-full ring-0 transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.15)]">
            {resolvedAvatar && !avatarFailed ? (
              <Image
                src={resolvedAvatar}
                alt={`${resolvedDisplayName} avatar`}
                fill
                sizes="96px"
                className="object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/25 text-2xl font-semibold text-white">
                {initials}
              </div>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{resolvedDisplayName}</h2>
          {resolvedTagline ? <p className="mt-2 max-w-[320px] text-sm text-white/70">{resolvedTagline.slice(0, 80)}</p> : null}
          {resolvedLinkedInUrl ? (
            <p className="mt-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/85">
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              {linkedInHandle}
            </p>
          ) : null}
        </div>

        {resolvedBio ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-sm leading-6 text-white/72"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {resolvedBio.slice(0, 280)}
          </motion.p>
        ) : null}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">Work experience</p>
          <p className="text-[10px] text-white/40">{isOwner && visibleExperience.length === 0 ? "Visible to you only" : ""}</p>
          </div>

          {visibleExperience.length > 0 ? (
            <div className="grid gap-2">
              {visibleExperience.map((item) => (
                <ExperienceCard key={`${item.company}-${item.role}-${item.startDate ?? ""}`} item={item} />
              ))}
            </div>
          ) : isOwner ? (
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Add experience →
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => void handleCopyLinkedIn()}
            disabled={!resolvedLinkedInUrl}
            aria-label="Copy LinkedIn URL"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Link2 className="h-4 w-4" aria-hidden="true" />
            Connect
          </button>
          <button
            type="button"
            onClick={onShare}
            disabled={!onShare}
            aria-label="Share card"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
        </div>
      </div>
    </article>
  );
}
