"use client";

import type { CardData } from "@/types/card";
import { Skeleton } from "@/components/ui/Skeleton";

const monoFont = "var(--font-space-mono), monospace";
const groteskFont = "var(--font-space-grotesk), sans-serif";

function hasText(value: string | null | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function LivePreviewCard({ previewData }: { previewData: CardData }) {
  const profile = previewData.profile;
  const name = profile.displayName?.trim() ?? "";
  const headline = profile.headline?.trim() ?? "";
  const bio = profile.bio?.trim() ?? "";
  const linkedinUrl = profile.linkedinUrl?.trim() ?? "";
  const currentRole = profile.currentRole?.trim() ?? "";
  const currentCompany = profile.currentCompany?.trim() ?? "";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 18,
        background: "#0d1117",
        border: "0.5px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.08)",
        overflow: "hidden",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: monoFont, fontSize: 9, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <span style={{ fontFamily: monoFont, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
            live preview
          </span>
        </div>
        <span style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
          updates live
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: hasText(profile.avatarUrl) ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
              border: hasText(profile.avatarUrl) ? "2px solid rgba(99,102,241,0.3)" : "none",
              outline: hasText(profile.avatarUrl) ? "5px solid rgba(99,102,241,0.07)" : "none",
            }}
          >
            {hasText(profile.avatarUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl ?? ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Skeleton width={56} height={56} radius={28} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {hasText(name) ? (
              <div style={{ fontFamily: groteskFont, fontSize: 21, fontWeight: 700, color: "#f0f4ff", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {name}
              </div>
            ) : (
              <Skeleton width={140} height={18} radius={6} />
            )}

            {hasText(headline) ? (
              <div
                style={{
                  marginTop: 8,
                  fontFamily: monoFont,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.3,
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {headline}
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <Skeleton width={200} height={10} radius={5} />
              </div>
            )}

            {hasText(linkedinUrl) ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(10,102,194,0.07)",
                  border: "0.5px solid rgba(10,102,194,0.18)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  marginTop: 10,
                }}
              >
                <span style={{ fontFamily: monoFont, fontSize: 8, color: "#0A66C2", fontWeight: 700 }}>in</span>
                <span style={{ fontFamily: monoFont, fontSize: 8.5, color: "#3d6a8a", letterSpacing: "0.02em" }}>
                  {linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "")}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ width: "100%", height: 0.5, background: "rgba(255,255,255,0.06)", margin: "2px 0 0" }} />

        {hasText(bio) ? (
          <div
            style={{
              fontFamily: groteskFont,
              fontWeight: 300,
              fontSize: 12,
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
              minHeight: 42,
            }}
          >
            {bio}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            <Skeleton width="100%" height={10} radius={5} />
            <Skeleton width="92%" height={10} radius={5} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <div style={{ flex: 1, height: 0.5, background: "rgba(255,255,255,0.06)" }} />
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 8.5,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            experience
          </span>
          <div style={{ flex: 1, height: 0.5, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {hasText(currentRole) || hasText(currentCompany) ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(255,255,255,.025)",
              border: "0.5px solid rgba(255,255,255,.07)",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: groteskFont, fontSize: 13, fontWeight: 600, color: "#d4e4f7", lineHeight: 1.3 }}>
                {currentRole || "Current role"}
              </div>
              <div style={{ marginTop: 3, fontFamily: monoFont, fontSize: 10, color: "#f89f1b", letterSpacing: "0.03em" }}>
                {currentCompany || "Company"}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(255,255,255,.025)",
              border: "0.5px solid rgba(255,255,255,.07)",
            }}
          >
            <Skeleton width={12} height={12} radius={6} />
            <div style={{ display: "grid", gap: 6, width: "100%" }}>
              <Skeleton width={160} height={10} radius={5} />
              <Skeleton width={120} height={9} radius={5} />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
