"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { RefreshCcw } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { getPlatformConfig, type PlatformKey } from "@/lib/platforms";
import type { PlatformData } from "@/lib/normalize";

interface StatWidgetProps {
  platform: PlatformKey;
  data?: PlatformData | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.55 2.87 8.4 6.84 9.77.5.1.68-.22.68-.48v-1.67c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.52 1.04 1.52 1.04.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.04 1.01-2.76-.1-.26-.44-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.26 9.26 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.54 1.43.2 2.49.1 2.75.63.72 1.01 1.64 1.01 2.76 0 3.94-2.35 4.81-4.58 5.06.36.32.68.95.68 1.92v2.84c0 .26.18.58.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M10 8.25 6.5 12l3.5 3.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8.25 16.5 12 13 15.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.2 16.8 14.8 7.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GFGIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M7.5 12.1c0-2.6 1.9-4.3 4.3-4.3 1.3 0 2.4.4 3.2 1.1l-1.2 1.4c-.6-.5-1.2-.7-2-.7-1.3 0-2.4.9-2.4 2.5 0 1.6 1.1 2.6 2.7 2.6.7 0 1.4-.1 1.9-.3v-1.4h-2.1v-1.7h4v4.2c-1 .8-2.4 1.3-3.8 1.3-3.3 0-4.6-2.2-4.6-4.7Z" fill="currentColor" />
    </svg>
  );
}

function CodeforcesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M7 8.5h10M7 12h7M7 15.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CodeChefIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 18.5c0-2 1.5-3.5 3.5-3.5h3c2 0 3.5 1.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 11.5c0-1.4.8-2.6 2-3.2l.6-1.5h2.8l.6 1.5c1.2.6 2 1.8 2 3.2v1c0 1.7-1.4 3.1-3.1 3.1H11.1C9.4 15.6 8 14.2 8 12.5v-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<PlatformKey, () => JSX.Element> = {
  github: GitHubIcon,
  leetcode: LeetCodeIcon,
  gfg: GFGIcon,
  codeforces: CodeforcesIcon,
  codechef: CodeChefIcon,
};

function formatFallback(value: number | string) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }

  return value;
}

export function StatWidget({
  platform,
  data,
  isLoading = false,
  error,
  onRetry,
  className,
}: StatWidgetProps) {
  const config = getPlatformConfig(platform);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const Icon = ICONS[platform];
  const resolvedError = error ?? data?.error ?? null;

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return <SkeletonCard className={className} />;
  }

  if (resolvedError || !data) {
    return (
      <div
        ref={ref}
        aria-busy="false"
        role="alert"
        className={[
          "flex min-h-[140px] flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-white/20",
          className ?? "",
        ].join(" ")}
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/80">
              <Icon />
            </span>
            <span>{config.label}</span>
          </div>
          <span className="text-xs text-white/45">@{data?.username ?? "—"}</span>
        </div>
        <div className="grid gap-2">
          <p className="text-sm text-rose-200">Failed to load</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={!onRetry}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-busy="false"
      data-platform={platform}
      className={[
        "flex min-h-[140px] flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white transition duration-200 hover:scale-[1.01] hover:border-white/20",
        className ?? "",
      ].join(" ")}
      style={
        {
          borderColor: `${config.color}30`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        } as CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: `${config.color}1f`, color: config.color }}
          >
            <Icon />
          </span>
          <span>{config.label}</span>
        </div>
        <span className="text-xs text-white/45">@{data.username}</span>
      </div>

      <div className="mt-4 grid gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">{data.primaryMetric.label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            <CountUp value={data.primaryMetric.value} trigger={isVisible} durationMs={1000} delayMs={300} />
          </p>
        </div>
        {data.secondaryMetric ? (
          <p className="text-sm text-white/70">
            <span className="text-white/45">{data.secondaryMetric.label}: </span>
            <span>
              {typeof data.secondaryMetric.value === "number" ? (
                <CountUp value={data.secondaryMetric.value} trigger={isVisible} durationMs={1000} delayMs={300} />
              ) : (
                formatFallback(data.secondaryMetric.value)
              )}
            </span>
          </p>
        ) : null}
        {data.tertiaryMetric ? (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span className="text-white/45">{data.tertiaryMetric.label}:</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
              {formatFallback(data.tertiaryMetric.value)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
