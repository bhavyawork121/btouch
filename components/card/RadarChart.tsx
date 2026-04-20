"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  Tooltip,
} from "recharts";
import { getPlatformConfig, type PlatformKey } from "@/lib/platforms";
import type { PlatformData } from "@/lib/normalize";

interface RadarChartProps {
  data: Partial<Record<PlatformKey, PlatformData | null>>;
  className?: string;
}

interface RadarPoint {
  platform: PlatformKey;
  initials: string;
  label: string;
  color: string;
  rawValue: number;
  score: number;
}

function asNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.]+/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function normalizeScore(platform: PlatformKey, rawValue: number) {
  switch (platform) {
    case "github":
      return Math.min(100, (Math.log10(rawValue + 1) / 5) * 100);
    case "leetcode":
      return Math.min(100, (rawValue / 3000) * 100);
    case "gfg":
      return Math.min(100, (rawValue / 1000) * 100);
    case "codeforces":
    case "codechef":
      return Math.min(100, (rawValue / 3000) * 100);
  }
}

interface RadarTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: RadarPoint }>;
}

function RadarTooltip({ active, payload }: RadarTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload as RadarPoint | undefined;
  if (!point) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs text-white shadow-2xl">
      <p className="font-medium">{point.label}</p>
      <p className="mt-1 text-white/70">Raw: {point.rawValue}</p>
      <p className="text-white/70">Score: {Math.round(point.score)} / 100</p>
    </div>
  );
}

export function RadarChart({ data, className }: RadarChartProps) {
  const points = useMemo(() => {
    const entries = Object.entries(data) as Array<[PlatformKey, PlatformData | null | undefined]>;

    return entries
      .flatMap(([platform, item]) => {
        if (!item || item.error) {
          return [];
        }

        const rawValue = asNumber(item.primaryMetric.value);
        if (rawValue === null) {
          return [];
        }

        const config = getPlatformConfig(platform);
        const score = normalizeScore(platform, rawValue);

        return [
          {
            platform,
            initials: config.initials,
            label: config.label,
            color: config.color,
            rawValue,
            score,
          },
        ];
      })
      .filter((point) => Number.isFinite(point.score));
  }, [data]);

  if (points.length < 3) {
    return null;
  }

  return (
    <div className={className} style={{ width: 200, height: 200 }}>
      <RechartsRadarChart width={200} height={200} data={points}>
        <PolarGrid stroke="rgba(255,255,255,0.12)" />
        <PolarAngleAxis dataKey="initials" tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 600 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<RadarTooltip />} />
        <Radar
          dataKey="score"
          stroke={points[0]?.color ?? "#fff"}
          fill={points[0]?.color ?? "#fff"}
          fillOpacity={0.25}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
        />
      </RechartsRadarChart>
    </div>
  );
}
