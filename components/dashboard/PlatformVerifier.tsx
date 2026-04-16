"use client";

import { useMemo } from "react";
import { z } from "zod";
import { Check, Loader2, RefreshCcw } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { getPlatformConfig, PLATFORM_KEYS, type PlatformKey } from "@/lib/platforms";
import type { PlatformData } from "@/lib/normalize";

const metricSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
});

const successSchema = z.object({
  platform: z.enum(PLATFORM_KEYS),
  username: z.string(),
  primaryMetric: metricSchema,
  secondaryMetric: metricSchema.optional(),
  tertiaryMetric: metricSchema.optional(),
  lastFetched: z.string(),
  error: z.string().optional(),
});

const errorSchema = z.object({
  error: z.string(),
});

export interface PlatformVerifierItem {
  enabled: boolean;
  username: string;
  verifiedData: PlatformData | null;
  isVerifying: boolean;
  error: string | null;
}

export type PlatformVerifierState = Record<PlatformKey, PlatformVerifierItem>;

interface PlatformVerifierProps {
  value: PlatformVerifierState;
  onChange: (next: PlatformVerifierState) => void;
  className?: string;
}

function createBaseState(value: PlatformVerifierState, platform: PlatformKey): PlatformVerifierItem {
  return {
    ...value[platform],
    verifiedData: value[platform].verifiedData,
  };
}

function isNumericValue(value: number | string) {
  return typeof value === "number" && Number.isFinite(value);
}

export function PlatformVerifier({ value, onChange, className }: PlatformVerifierProps) {
  const orderedPlatforms = useMemo(() => PLATFORM_KEYS, []);

  function update(platform: PlatformKey, patch: Partial<PlatformVerifierItem>) {
    onChange({
      ...value,
      [platform]: {
        ...value[platform],
        ...patch,
      },
    });
  }

  async function verify(platform: PlatformKey) {
    const username = value[platform].username.trim();
    if (!username) {
      update(platform, { error: "Username required." });
      return;
    }

    update(platform, { isVerifying: true, error: null });

    try {
      const response = await fetch(`/api/stats/${platform}/${encodeURIComponent(username)}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const errorResult = errorSchema.safeParse(payload);
        update(platform, {
          isVerifying: false,
          verifiedData: null,
          error: errorResult.success ? "Username not found" : "Could not verify username.",
        });
        return;
      }

      const successResult = successSchema.safeParse(payload);
      if (!successResult.success) {
        update(platform, {
          isVerifying: false,
          verifiedData: null,
          error: "Could not verify username.",
        });
        return;
      }

      update(platform, {
        isVerifying: false,
        verifiedData: successResult.data,
        error: null,
      });
    } catch {
      update(platform, {
        isVerifying: false,
        verifiedData: null,
        error: "Could not verify username.",
      });
    }
  }

  return (
    <div className={["grid gap-4", className ?? ""].join(" ")}>
      {orderedPlatforms.map((platform) => {
        const config = getPlatformConfig(platform);
        const item = createBaseState(value, platform);
        const enabled = item.enabled;
        const verified = Boolean(item.verifiedData && !item.error);

        return (
          <div
            key={platform}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
            aria-busy={item.isVerifying ? "true" : "false"}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: `${config.color}22` }}
                  aria-hidden="true"
                >
                  {config.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{config.label}</p>
                  <p className="text-xs text-white/55">{config.handleHint}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => update(platform, { enabled: !enabled, error: null, verifiedData: enabled ? null : item.verifiedData })}
                aria-pressed={enabled}
                aria-label={`${enabled ? "Disable" : "Enable"} ${config.label}`}
                className={[
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  enabled ? "border-white/25 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-5 w-9 rounded-full border transition",
                    enabled ? "border-emerald-400/35 bg-emerald-400/20" : "border-white/15 bg-white/10",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <span
                    className={[
                      "mt-[2px] inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                      enabled ? "translate-x-4" : "translate-x-1",
                    ].join(" ")}
                  />
                </span>
              </button>
            </div>

            <div
              className={[
                "grid overflow-hidden transition-all duration-300 ease-out",
                enabled ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <div className="grid gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm text-white/80" htmlFor={`platform-${platform}`}>
                      Username
                    </label>
                    <input
                      id={`platform-${platform}`}
                      type="text"
                      value={item.username}
                      onChange={(event) => update(platform, { username: event.target.value, error: null, verifiedData: null })}
                      className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25 focus-visible:ring-2 focus-visible:ring-white/40"
                      placeholder={config.handleHint}
                      aria-label={`${config.label} username`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => void verify(platform)}
                    disabled={!item.username.trim() || item.isVerifying}
                    className={[
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                      verified ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                      item.isVerifying ? "w-11" : "w-auto",
                    ].join(" ")}
                  >
                    {item.isVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : verified ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                    )}
                    {!item.isVerifying ? (verified ? "Verified" : "Verify") : null}
                  </button>
                </div>

                {item.error ? (
                  <p className="text-sm text-rose-200" role="alert">
                    {item.error}
                  </p>
                ) : null}

                {verified && item.verifiedData ? (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                          {item.verifiedData.primaryMetric.label}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-white">
                          {isNumericValue(item.verifiedData.primaryMetric.value) ? (
                            <CountUp value={item.verifiedData.primaryMetric.value} durationMs={800} />
                          ) : (
                            item.verifiedData.primaryMetric.value
                          )}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/15 px-2 py-1 text-xs font-medium text-emerald-100">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
