"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RadarChart as RadarStatChart } from "@/components/card/RadarChart";
import { StatWidget } from "@/components/card/StatWidget";
import { normalizePlatformData, type PlatformData } from "@/lib/normalize";
import { type PlatformKey } from "@/lib/platforms";
import type { CardData } from "@/types/card";

export interface PlatformWidgetSource {
  platform: PlatformKey;
  data?: PlatformData | null;
  isLoading?: boolean;
  error?: string | null;
}

interface CardBackProps {
  data?: CardData;
  platforms?: PlatformWidgetSource[];
  theme?: "dark" | "light" | "auto";
  isActive?: boolean;
  updatedAt?: string;
  onRefresh?: () => void;
  emptyStateHref?: string;
  className?: string;
}

function legacyPlatformsFromCardData(data: CardData): PlatformWidgetSource[] {
  const sources: PlatformWidgetSource[] = [];
  const configured = new Set(data.config.showPlatforms);

  if (configured.has("github")) {
    sources.push({ platform: "github", data: normalizePlatformData("github", data.stats.github, data.config.username) });
  }
  if (configured.has("leetcode")) {
    sources.push({ platform: "leetcode", data: normalizePlatformData("leetcode", data.stats.leetcode, data.config.username) });
  }
  if (configured.has("codeforces")) {
    sources.push({ platform: "codeforces", data: normalizePlatformData("codeforces", data.stats.codeforces, data.config.username) });
  }
  if (configured.has("gfg")) {
    sources.push({ platform: "gfg", data: normalizePlatformData("gfg", data.stats.gfg, data.config.username) });
  }

  return sources;
}

function relativeTimeLabel(isoTimestamp?: string | null) {
  if (!isoTimestamp) {
    return "just now";
  }

  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 60_000) {
    return "just now";
  }

  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

function EmptyState({ href }: { href?: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
      <svg viewBox="0 0 240 160" className="mb-5 h-28 w-40" aria-hidden="true">
        <rect x="18" y="18" width="84" height="24" rx="12" fill="rgba(255,255,255,0.08)" />
        <rect x="50" y="54" width="140" height="76" rx="24" fill="rgba(255,255,255,0.05)" />
        <circle cx="80" cy="82" r="18" fill="rgba(255,255,255,0.14)" />
        <rect x="108" y="68" width="64" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="108" y="88" width="48" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
      </svg>
      <h3 className="text-lg font-semibold text-white">Add your coding profiles in dashboard</h3>
      <p className="mt-2 max-w-sm text-sm text-white/60">
        Connect at least one platform to unlock the stats face and its radar chart.
      </p>
      {href ? (
        <Link
          href={href}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Go to dashboard
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export function CardBack({
  data,
  platforms,
  theme,
  isActive = false,
  updatedAt,
  onRefresh,
  emptyStateHref,
  className,
}: CardBackProps) {
  const [animationSeed, setAnimationSeed] = useState(0);
  const resolvedPlatforms = platforms ?? (data ? legacyPlatformsFromCardData(data) : []);
  const resolvedTheme = theme ?? data?.appearance.theme ?? "dark";

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAnimationSeed((current) => current + 1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [isActive]);

  const platformMap = useMemo(() => {
    return resolvedPlatforms.reduce<Partial<Record<PlatformKey, PlatformData | null>>>((accumulator, item) => {
      accumulator[item.platform] = item.data ?? null;
      return accumulator;
    }, {});
  }, [resolvedPlatforms]);

  const platformWidgets = resolvedPlatforms.map((item, index) => (
    <motion.div
      key={`${item.platform}-${animationSeed}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <StatWidget
        platform={item.platform}
        data={item.data ?? null}
        isLoading={item.isLoading}
        error={item.error ?? item.data?.error ?? null}
        onRetry={onRefresh}
        className="h-full"
      />
    </motion.div>
  ));

  const hasPlatforms = resolvedPlatforms.length > 0;
  const platformCount = resolvedPlatforms.filter((item) => item.data && !item.data.error).length;
  const lastUpdatedLabel = relativeTimeLabel(
    updatedAt ?? data?.meta.lastRefreshed ?? resolvedPlatforms.find((item) => item.data?.lastFetched)?.data?.lastFetched ?? null,
  );

  const surfaceStyle =
    resolvedTheme === "light"
      ? {
          backgroundColor: "rgba(255,255,255,0.88)",
          color: "#0f172a",
          borderColor: "rgba(15,23,42,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
        }
      : {
          backgroundColor: "rgba(0,0,0,0.85)",
          color: "#f8fafc",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        };

  return (
    <section
      className={[
        "flex h-full w-full flex-col rounded-[28px] border p-4 backdrop-blur-2xl",
        className ?? "",
      ].join(" ")}
      style={surfaceStyle}
      aria-busy={resolvedPlatforms.some((item) => item.isLoading) ? "true" : "false"}
      aria-label="Developer card stats face"
    >
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">Stats</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/55">
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh stats"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </button>
          ) : (
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>Last updated: {lastUpdatedLabel}</span>
        </div>
      </div>

      {!hasPlatforms ? (
        <EmptyState href={emptyStateHref} />
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">{platformWidgets}</div>

          {platformCount >= 3 ? (
            <div className="flex justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <RadarStatChart data={platformMap} />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
