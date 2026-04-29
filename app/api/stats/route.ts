import { NextResponse } from "next/server";
import { fetchPlatformStats } from "@/lib/platform-stats";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stats = await fetchPlatformStats({
    github: url.searchParams.get("github") || "",
    leetcode: url.searchParams.get("leetcode") || "",
    codeforces: url.searchParams.get("codeforces") || "",
    gfg: url.searchParams.get("gfg") || "",
  });

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
