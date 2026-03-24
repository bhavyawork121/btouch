"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CardSkeleton } from "@/components/card/CardSkeleton";
import { FlipCard } from "@/components/card/FlipCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { QRExport } from "@/components/ui/QRExport";
import { useCardData } from "@/hooks/useCardData";
import { publicCopy } from "@/lib/copy";
import { getThemeSurface, resolveTheme } from "@/lib/theme";
import { useEffect, useState } from "react";
import type { CardData, PlatformName } from "@/types/card";

const bannerMessages = {
  stale: "Some stats may be outdated · last updated {time}",
  error: "Could not load stats for: {platforms}",
  partial: "{n} of {total} platforms loaded",
} as const;

function getBannerMessage(type: keyof typeof bannerMessages, vars: Record<string, string>) {
  return bannerMessages[type].replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

interface PublicCardShellProps {
  initialData: CardData;
  shareUrl: string;
  username: string;
}

export function PublicCardShell({ initialData, shareUrl, username }: PublicCardShellProps) {
  const queryClient = useQueryClient();
  const { data, error, isFetching, isPending, refetch } = useCardData(username, initialData);
  const [retryingPlatform, setRetryingPlatform] = useState<PlatformName | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const card = data ?? initialData;
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    card.appearance.theme === "light" ? "light" : "dark",
  );
  const surface = getThemeSurface(resolvedTheme);
  const hasStalePlatforms = card.meta.stalePlatforms.length > 0;
  const retryablePlatforms = (Object.entries(card.stats) as [PlatformName, CardData["stats"][PlatformName]][]).filter(
    ([, value]) => value?.status === "stale" || value?.status === "error",
  );

  async function retryPlatform(platform: PlatformName) {
    setRetryingPlatform(platform);
    setRetryMessage(null);

    try {
      const response = await fetch(`/api/card/${username}?refreshPlatform=${platform}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Retry failed for ${platform}`);
      }

      const nextCard = (await response.json()) as CardData;
      queryClient.setQueryData(["card", username], nextCard);
    } catch {
      setRetryMessage(`Retry failed for ${platform}.`);
    } finally {
      setRetryingPlatform(null);
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setResolvedTheme(resolveTheme(card.appearance.theme, mediaQuery.matches));

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [card.appearance.theme]);

  return (
    <main
      className="page-bg flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 py-12"
      style={{ color: surface.foreground }}
    >
      <div
        className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: surface.border, background: surface.panel }}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: surface.muted }}>
            Public Card
          </p>
          <h1 className="font-display text-xl font-semibold">btouch.dev/{username}</h1>
          <p className="mt-1 text-sm" style={{ color: surface.muted }}>
            {isFetching ? publicCopy.loading : publicCopy.ready}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CopyButton value={shareUrl} />
        </div>
      </div>

      {error ? (
        <div className="flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p>{publicCopy.refreshFailed}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            Retry
          </button>
        </div>
      ) : null}

      {hasStalePlatforms ? (
        <div
          className="w-full max-w-xl rounded-2xl border px-4 py-3 text-sm backdrop-blur"
          style={{ borderColor: surface.border, background: surface.panel, color: surface.muted }}
        >
          <p>{getBannerMessage("error", { platforms: card.meta.stalePlatforms.join(", ") })}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {retryablePlatforms.map(([platform, value]) => (
              <button
                key={platform}
                type="button"
                onClick={() => void retryPlatform(platform)}
                disabled={retryingPlatform !== null}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {retryingPlatform === platform ? `Retrying ${platform}` : `Retry ${platform}`}
                {value?.status === "error" ? " error" : ""}
              </button>
            ))}
          </div>
          {retryMessage ? <p className="mt-3 text-xs text-amber-200">{retryMessage}</p> : null}
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-4">
        {isPending && !data ? <CardSkeleton /> : <FlipCard data={card} username={username} />}
        <QRExport url={shareUrl} title={`Share ${card.profile.displayName}`} />
      </div>
    </main>
  );
}
