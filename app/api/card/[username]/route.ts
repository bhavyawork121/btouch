import { NextResponse } from "next/server";
import { z } from "zod";
import { getCardDataByUsername } from "@/lib/card-service";
import { connectDB } from "@/lib/mongodb";
import { rateLimitRequest } from "@/lib/rateLimit";
import type { PlatformName } from "@/types/card";

const paramsSchema = z.object({
  username: z.string().min(2).max(39).regex(/^[a-zA-Z0-9-]+$/),
});
const searchSchema = z.object({
  refreshPlatform: z.enum(["github", "leetcode", "codeforces", "gfg"]).optional(),
});

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return request.headers.get("x-real-ip") ?? "anonymous";
}

export async function GET(request: Request, { params }: { params: { username: string } }) {
  await connectDB();
  const parsed = paramsSchema.safeParse(params);
  const searchParsed = searchSchema.safeParse({
    refreshPlatform: new URL(request.url).searchParams.get("refreshPlatform") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid username", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!searchParsed.success) {
    return NextResponse.json(
      { error: "Invalid search params", details: searchParsed.error.flatten() },
      { status: 400 },
    );
  }

  const rateLimit = await rateLimitRequest(getClientIp(request));

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  const refreshPlatforms = searchParsed.data.refreshPlatform
    ? [searchParsed.data.refreshPlatform as PlatformName]
    : undefined;

  const card = await getCardDataByUsername(parsed.data.username, { refreshPlatforms });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
