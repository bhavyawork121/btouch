import { ImageResponse } from "@vercel/og";
import { getUserConfig } from "@/lib/btouch";
import { fetchPlatformStats } from "@/lib/platform-stats";
import { formatCount, formatRating } from "@/lib/formatters";

export async function GET(req: Request) {
  const username = new URL(req.url).searchParams.get("username");
  if (!username) {
    return new Response("Missing username", { status: 400 });
  }

  const user = await getUserConfig(username);
  if (!user) {
    return new Response("Not found", { status: 404 });
  }

  const stats = await fetchPlatformStats(user.handles);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0c0c0c",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          color: "#ede8de",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 420,
            height: 520,
            borderRadius: 24,
            background: "#ede8de",
            color: "#0d0d0d",
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: "#666", marginBottom: 24 }}>
              btouch developer identity
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, fontFamily: "serif", marginBottom: 12 }}>{user.name}</div>
            <div style={{ fontSize: 18, color: "#555", marginBottom: 18 }}>{user.tagline || "Developer identity card"}</div>
            <div style={{ fontSize: 16, color: "#666", lineHeight: 1.5 }}>{user.bio}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {user.skills.slice(0, 3).map((skill) => (
              <div key={skill} style={{ border: "1px solid #c8c0b4", borderRadius: 999, padding: "6px 12px", fontSize: 14 }}>
                {skill}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 520, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["GitHub", stats.github ? `${formatCount(stats.github.contributions)} commits / ${formatCount(stats.github.stars)} stars` : "—"],
            ["LeetCode", stats.leetcode ? `${formatCount(stats.leetcode.solved)} solved / ${Math.round(stats.leetcode.acceptanceRate)}% acc` : "—"],
            ["Codeforces", stats.codeforces ? `${formatRating(stats.codeforces.rating)} rating / ${stats.codeforces.rank}` : "—"],
            ["GFG", stats.gfg ? `${formatCount(stats.gfg.score)} score / ${formatCount(stats.gfg.problemsSolved)} solved` : "—"],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #222", background: "#111", borderRadius: 16, padding: "18px 22px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 24 }}>{label}</span>
              <span style={{ fontSize: 24, color: "#c8c0b4" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
