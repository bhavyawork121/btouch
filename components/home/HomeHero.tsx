"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FlipCard } from "@/components/card/FlipCard";
import { LivePreviewCard } from "@/components/card/LivePreviewCard";
import { OnboardingCard } from "@/components/card/OnboardingCard";
import { getDemoCardData } from "@/lib/demo-card";
import { createEmptyCardData } from "@/lib/normalize";
import type { CardData } from "@/types/card";

const monoFont = "var(--font-space-mono), monospace";
const groteskFont = "var(--font-space-grotesk), sans-serif";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    title: "LinkedIn front",
    desc: "Profile identity tuned for first impression.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
      </svg>
    ),
    title: "Live coding stats",
    desc: "GitHub, LeetCode, Codeforces, and GFG in one view.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f89f1b" strokeWidth="1.5">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: "Shareable URL",
    desc: "Optimised SSR card pages and QR export for sharing.",
  },
] as const;

export function HomeHero() {
  const [previewData, setPreviewData] = useState<CardData>(() => createEmptyCardData("preview"));
  const [showDemoSheet, setShowDemoSheet] = useState(false);
  const demoCard = useMemo(() => getDemoCardData(), []);

  return (
    <main
      className="relative overflow-hidden text-white page-enter"
      style={{
        minHeight: "100vh",
        backgroundColor: "#060810",
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 50% 30% at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 50%)
        `,
      }}
    >
      <div className="absolute inset-0 card-grid opacity-40" />
      <div
        className="home-shell"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 430px)",
          gap: 60,
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 40px",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 50,
              padding: "6px 14px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#6366f1",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontFamily: monoFont, fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
              Public developer cards with live platform stats
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
            }}
          >
            One card.
            <br />
            Two faces.
            <br />
            All of your
            <br />
            developer identity.
          </h1>

          <p
            style={{
              fontFamily: groteskFont,
              fontSize: 16,
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 0 36px",
            }}
          >
            btouch turns your LinkedIn presence and coding platform history into an animated flip card that feels
            built, not generated.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#ffffff",
                color: "#0a0a0a",
                border: "none",
                borderRadius: 50,
                padding: "14px 28px",
                fontFamily: groteskFont,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Build your card →
            </Link>
            <button
              type="button"
              onClick={() => setShowDemoSheet(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "14px 28px",
                fontFamily: groteskFont,
                fontSize: 15,
                fontWeight: 400,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              View live example
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 0",
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              marginTop: 32,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "2.4k", label: "cards created" },
              { num: "48k", label: "profile views" },
              { num: "< 1s", label: "avg load time" },
              { num: "4", label: "platforms fetched" },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: groteskFont, fontSize: 16, fontWeight: 700, color: "#f0f4ff" }}>
                  {stat.num}
                </span>
                <span style={{ fontFamily: monoFont, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginTop: 48,
              maxWidth: 620,
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "20px 20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feature.icon}
                </div>
                <div style={{ fontFamily: groteskFont, fontSize: 14, fontWeight: 600, color: "#f0f4ff", letterSpacing: "-0.01em" }}>
                  {feature.title}
                </div>
                <div style={{ fontFamily: groteskFont, fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44 }}>
            <OnboardingCard onDataChange={setPreviewData} />
          </div>
        </div>

        <div style={{ position: "sticky", top: 40, alignSelf: "start", display: "flex", justifyContent: "center" }}>
          <LivePreviewCard previewData={previewData} />
        </div>
      </div>

      {showDemoSheet ? (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setShowDemoSheet(false)}
            style={{ flex: 1, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />
          <div
            style={{
              width: 480,
              maxWidth: "100vw",
              background: "#0a0c12",
              borderLeft: "0.5px solid rgba(255,255,255,0.08)",
              padding: "32px 28px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              animation: "slideInRight 0.3s ease-out",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <span style={{ fontFamily: monoFont, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
                LIVE DEMO
              </span>
              <button
                type="button"
                onClick={() => setShowDemoSheet(false)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <FlipCard data={demoCard} username={demoCard.config.username} />
            <a
              href="/dashboard"
              style={{
                width: "100%",
                textAlign: "center",
                padding: "11px 0",
                background: "rgba(99,102,241,0.15)",
                border: "0.5px solid rgba(99,102,241,0.35)",
                borderRadius: 8,
                fontFamily: monoFont,
                fontSize: 10,
                color: "#a5b4fc",
                textDecoration: "none",
                letterSpacing: "0.1em",
              }}
            >
              build yours →
            </a>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .home-shell {
            grid-template-columns: 1fr !important;
            padding: 40px 20px !important;
            gap: 36px !important;
            min-height: auto !important;
          }

          .home-shell h1 {
            font-size: clamp(36px, 11vw, 52px) !important;
          }

          .home-shell > div:last-child {
            position: static !important;
          }

          .home-shell > div:first-child > div:nth-of-type(4) {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
          }

          .home-shell > div:first-child > div:nth-of-type(5) {
            grid-template-columns: 1fr !important;
          }

          .home-shell > div:first-child > div:last-child {
            margin-top: 32px !important;
          }
        }
      `}</style>
    </main>
  );
}
