import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import {
  formatDateRange,
  getInitials,
  normalizeOgExperience,
  resolveCardBackground,
  stripLinkedInHandle,
  truncateText,
} from "@/lib/og-utils";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
  const card = await prisma.cardConfig.findUnique({
    where: { username: params.username.toLowerCase() },
  });

  const displayName = card?.displayName?.trim() || card?.username || params.username;
  const tagline = card?.tagline?.trim() || card?.headline?.trim() || "";
  const bio = card?.bio?.trim() || "";
  const avatarUrl = card?.avatarUrl?.trim() || "";
  const linkedInUrl = card?.linkedinUrl?.trim() || "";
  const linkedInHandle = linkedInUrl ? stripLinkedInHandle(linkedInUrl) : "";
  const experiences = normalizeOgExperience(card?.workExperience ?? card?.experience).slice(0, 2);
  const background = resolveCardBackground(card?.cardBackground);
  const initials = getInitials(displayName);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: background,
          color: "white",
          padding: 54,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.28))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              b
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>btouch</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Developer identity card</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{params.username}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>btouch.dev/{params.username}</div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 28,
            alignItems: "stretch",
            flex: 1,
          }}
        >
          <div
            style={{
              flex: 1.05,
              borderRadius: 36,
              background: "rgba(0,0,0,0.28)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(18px)",
              display: "flex",
              flexDirection: "column",
              padding: 36,
              boxShadow: "0 30px 90px rgba(0,0,0,0.24)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 118,
                  height: 118,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 0 0 4px rgba(255,255,255,0.14)",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 42, fontWeight: 700 }}>{initials}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
                <div style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 8, borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", padding: "6px 12px", fontSize: 12, fontWeight: 600 }}>
                  LinkedIn verified
                </div>
                <h1 style={{ fontSize: 62, lineHeight: 1, fontWeight: 700, letterSpacing: -1.8, margin: 0 }}>{displayName}</h1>
                {tagline ? (
                  <p style={{ margin: 0, fontSize: 22, lineHeight: 1.4, color: "rgba(255,255,255,0.82)", maxWidth: 660 }}>
                    {truncateText(tagline, 80)}
                  </p>
                ) : null}
                {linkedInHandle ? (
                  <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.65)" }}>linkedin.com/in/{linkedInHandle}</p>
                ) : null}
              </div>
            </div>

            {bio ? (
              <p
                style={{
                  marginTop: 28,
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 720,
                }}
              >
                {truncateText(bio, 220)}
              </p>
            ) : null}
          </div>

          <div
            style={{
              flex: 0.95,
              borderRadius: 36,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <div
                  key={`${experience.company}-${experience.role}`}
                  style={{
                    borderRadius: 28,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: 22,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 132,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {experience.logoUrl || experience.domain ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={experience.logoUrl ?? `https://logo.clearbit.com/${experience.domain}`}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: 16, fontWeight: 700 }}>
                          {getInitials(experience.company)}
                        </span>
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{experience.role}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
                        {experience.company} • {formatDateRange(experience.startDate, experience.endDate)}
                      </div>
                    </div>
                  </div>
                  {experience.description ? (
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.72)" }}>
                      {truncateText(experience.description, 90)}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div
                style={{
                  borderRadius: 28,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: 24,
                  minHeight: 132,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 16,
                }}
              >
                Add your experience to show your journey here.
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
