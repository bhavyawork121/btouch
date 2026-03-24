import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const platformLabelMap: Record<string, string> = {
  github: "GitHub",
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  gfg: "GFG",
};

export default async function Image({ params }: { params: { username: string } }) {
  const card = await prisma.cardConfig.findUnique({
    where: { username: params.username.toLowerCase() },
  });

  const displayName = card?.displayName?.trim() || params.username;
  const headline = card?.headline?.trim() || displayName || "";
  const platformLine =
    card?.showPlatforms
      ?.filter((platform) => {
        if (platform === "github") return Boolean(card.githubHandle);
        if (platform === "leetcode") return Boolean(card.leetcodeHandle);
        if (platform === "codeforces") return Boolean(card.cfHandle);
        if (platform === "gfg") return Boolean(card.gfgHandle);
        return false;
      })
      .map((platform) => platformLabelMap[platform] ?? platform)
      .join(" · ") ?? "coding stats";

  const tiles = [
    card?.showPlatforms?.includes("github") && card.githubHandle ? ["GitHub", card.githubHandle] : null,
    card?.showPlatforms?.includes("leetcode") && card.leetcodeHandle ? ["LeetCode", card.leetcodeHandle] : null,
    card?.showPlatforms?.includes("codeforces") && card.cfHandle ? ["Codeforces", card.cfHandle] : null,
    card?.showPlatforms?.includes("gfg") && card.gfgHandle ? ["GFG", card.gfgHandle] : null,
  ].filter(Boolean) as Array<[string, string]>;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #06080d 0%, #111723 58%, #0A66C2 100%)",
          color: "white",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            padding: 44,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>
                btouch
              </span>
              <span style={{ fontSize: 60, fontWeight: 700 }}>{displayName}</span>
              <span style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>{headline}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "right" }}>
              <span style={{ fontSize: 24 }}>{params.username}</span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.72)" }}>{platformLine}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {tiles.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  borderRadius: 22,
                  padding: "20px 24px",
                  background: "rgba(255,255,255,0.08)",
                  minWidth: 180,
                }}
              >
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>{label}</span>
                <span style={{ fontSize: 38, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
