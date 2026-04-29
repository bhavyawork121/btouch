"use client";

import useSWR from "swr";
import type { PlatformStats } from "@/types/stats";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load stats");
  }
  return (await response.json()) as PlatformStats;
};

export function usePlatformStats(handles: {
  github?: string;
  leetcode?: string;
  codeforces?: string;
  gfg?: string;
}) {
  const search = new URLSearchParams();
  if (handles.github) search.set("github", handles.github);
  if (handles.leetcode) search.set("leetcode", handles.leetcode);
  if (handles.codeforces) search.set("codeforces", handles.codeforces);
  if (handles.gfg) search.set("gfg", handles.gfg);
  const key = search.toString() ? `/api/stats?${search.toString()}` : null;

  return useSWR<PlatformStats>(key, fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });
}
