import Link from "next/link";
import { FlipCard } from "@/components/card/FlipCard";
import { getDemoCardData } from "@/lib/demo-card";

export default function DemoPage() {
  const demoCard = getDemoCardData();

  return (
    <main
      className="page-enter"
      style={{
        minHeight: "100vh",
        backgroundColor: "#060810",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "60px 20px",
        color: "#fff",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 card-grid opacity-40" />

      <div
        style={{
          textAlign: "center",
          marginBottom: 48,
          maxWidth: 600,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 50,
            padding: "6px 14px",
            marginBottom: 20,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.08em",
            }}
          >
            Sample card preview
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 14,
          }}
        >
          Live example with one card
        </h1>

        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          Open the sleeve to reveal the profile card, then flip it to the live stats side.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ffffff",
              color: "#0a0a0a",
              borderRadius: 50,
              padding: "12px 24px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Open dashboard →
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "0.5px solid rgba(255,255,255,0.18)",
              borderRadius: 50,
              padding: "12px 24px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              textDecoration: "none",
            }}
          >
            Back home
          </Link>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
          minHeight: "640px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FlipCard data={demoCard} username={demoCard.config.username} />
      </div>
    </main>
  );
}
