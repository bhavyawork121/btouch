import { ImageResponse } from "next/og";
import { getCardDataByUsername } from "@/lib/card-service";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
  const data = await getCardDataByUsername(params.username);

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
              <span style={{ fontSize: 60, fontWeight: 700 }}>{data?.profile.displayName ?? params.username}</span>
              <span style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>{data?.profile.headline ?? "Developer identity card"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "right" }}>
              <span style={{ fontSize: 24 }}>{params.username}</span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.72)" }}>GitHub · LeetCode · Codeforces · GFG</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["GitHub", data?.stats.github?.followers ?? 0],
              ["LeetCode", data?.stats.leetcode?.solved.total ?? 0],
              ["Codeforces", data?.stats.codeforces?.rating ?? 0],
              ["GFG", data?.stats.gfg?.solved ?? 0],
            ].map(([label, value]) => (
              <div
                key={String(label)}
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
                <span style={{ fontSize: 38, fontWeight: 700 }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
