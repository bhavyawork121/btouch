"use client";

import Link from "next/link";
import { MoonStar, SunMedium } from "lucide-react";
import { useMemo } from "react";
import { useUiTheme } from "@/components/theme/UiThemeProvider";

interface HomepageUser {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  tagline: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
}

interface HomePageClientProps {
  isAuthed: boolean;
  dashHref: string;
  quote: string;
  dateLabel: string;
  users: HomepageUser[];
}

function getTheme(mode: "dark" | "light") {
  if (mode === "light") {
    return {
      pageBackground: "#e8e8e8",
      pageImage:
        "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(17,24,39,0.06) 0%, transparent 50%)",
      navBorder: "rgba(17,24,39,0.12)",
      footerBorder: "rgba(17,24,39,0.12)",
      divider: "rgba(17,24,39,0.12)",
      text: "#111111",
      textStrong: "#111111",
      textMuted: "rgba(17,24,39,0.72)",
      textSoft: "rgba(17,24,39,0.56)",
      textFaint: "rgba(17,24,39,0.38)",
      panelBg: "rgba(255,255,255,0.8)",
      panelBorder: "rgba(17,24,39,0.12)",
      panelGradient: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(242,242,242,0.88))",
      cardBg: "rgba(255,255,255,0.76)",
      cardBorder: "rgba(17,24,39,0.12)",
      pillBg: "rgba(17,24,39,0.04)",
      pillBorder: "rgba(17,24,39,0.12)",
      secondaryText: "rgba(17,24,39,0.72)",
      primaryButtonBg: "#111111",
      primaryButtonText: "#dfd5d5",
      secondaryButtonText: "#111111",
      secondaryButtonBorder: "rgba(17,24,39,0.12)",
      secondaryButtonBg: "rgba(17,24,39,0.04)",
      brandButtonBg: "rgba(99,102,241,0.1)",
      brandButtonBorder: "rgba(99,102,241,0.24)",
      brandButtonText: "#4f46e5",
      accentSoft: "rgba(17,24,39,0.04)",
      emptyStateText: "rgba(17,24,39,0.64)",
    };
  }

  return {
    pageBackground: "#0c0c0c",
    pageImage:
      "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99,102,241,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(124,58,237,0.06) 0%, transparent 50%)",
    navBorder: "rgba(255,255,255,0.08)",
    footerBorder: "rgba(255,255,255,0.08)",
    divider: "rgba(255,255,255,0.08)",
    text: "#f4f1ea",
    textStrong: "#f4f1ea",
    textMuted: "rgba(255,255,255,0.58)",
    textSoft: "rgba(255,255,255,0.35)",
    textFaint: "rgba(255,255,255,0.24)",
    panelBg: "rgba(255,255,255,0.03)",
    panelBorder: "rgba(255,255,255,0.08)",
      panelGradient: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    cardBg: "rgba(255,255,255,0.025)",
    cardBorder: "rgba(255,255,255,0.07)",
    pillBg: "rgba(99,102,241,0.12)",
    pillBorder: "rgba(99,102,241,0.24)",
    secondaryText: "rgba(255,255,255,0.72)",
    primaryButtonBg: "#dfd5d5",
    primaryButtonText: "#111111",
    secondaryButtonText: "rgba(255,255,255,0.58)",
    secondaryButtonBorder: "rgba(255,255,255,0.12)",
    secondaryButtonBg: "rgba(255,255,255,0.03)",
    brandButtonBg: "rgba(99,102,241,0.14)",
    brandButtonBorder: "rgba(99,102,241,0.32)",
    brandButtonText: "#a5b4fc",
    accentSoft: "rgba(255,255,255,0.03)",
    emptyStateText: "rgba(255,255,255,0.58)",
  };
}

export function HomePageClient({ isAuthed, dashHref, quote, dateLabel, users }: HomePageClientProps) {
  const { uiTheme, toggleUiTheme } = useUiTheme();

  const theme = useMemo(() => getTheme(uiTheme), [uiTheme]);

  return (
    <div
      data-ui-theme={uiTheme}
      className="page-wrapper page-enter"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        backgroundColor: theme.pageBackground,
        backgroundImage: theme.pageImage,
        display: "grid",
        gridTemplateRows: "56px minmax(0, 1fr) 48px",
        fontFamily: "'Space Grotesk', sans-serif",
        color: theme.text,
      }}
    >
      <nav
        className="page-nav"
        style={{
          height: 56,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 48px",
          borderBottom: `0.5px solid ${theme.navBorder}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: theme.textMuted,
              letterSpacing: "0.04em",
            }}
          >
            btouch
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={toggleUiTheme}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              padding: "7px 14px",
              borderRadius: 999,
              border: `0.5px solid ${theme.secondaryButtonBorder}`,
              background: theme.secondaryButtonBg,
              color: theme.secondaryButtonText,
              cursor: "pointer",
            }}
            aria-label={`Switch to ${uiTheme === "dark" ? "light" : "dark"} theme`}
          >
            <SunMedium size={14} color={uiTheme === "light" ? "#d97706" : theme.textFaint} />
            {uiTheme === "light" ? "light" : "dark"}
            <MoonStar size={14} color={uiTheme === "dark" ? "#67e8f9" : theme.textFaint} />
          </button>
          <Link
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: theme.brandButtonText,
              textDecoration: "none",
              letterSpacing: "0.08em",
              padding: "7px 14px",
              borderRadius: 999,
              border: `0.5px solid ${theme.brandButtonBorder}`,
              background: theme.brandButtonBg,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset, 0 10px 24px rgba(79,70,229,0.12)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#6366f1",
                boxShadow: "0 0 0 4px rgba(99,102,241,0.12)",
              }}
            />
            see example
          </Link>
          <Link
            href={dashHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: theme.brandButtonBg,
              border: `0.5px solid ${theme.brandButtonBorder}`,
              borderRadius: 7,
              padding: "7px 16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: theme.brandButtonText,
              textDecoration: "none",
              letterSpacing: "0.06em",
            }}
          >
            {isAuthed ? "dashboard →" : "sign in"}
          </Link>
        </div>
      </nav>

      <main
        className="main-grid"
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        <div
          className="left-col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 56px",
            borderRight: `0.5px solid ${theme.divider}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: theme.accentSoft,
              border: `0.5px solid ${theme.panelBorder}`,
              borderRadius: 50,
              padding: "4px 12px",
              marginBottom: 28,
              width: "fit-content",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#6366f1",
                animation: "bpulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: theme.textMuted,
                letterSpacing: "0.12em",
              }}
            >
              developer identity directory
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px,4.5vw,64px)",
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              margin: "0 0 22px",
            }}
          >
            One card.
            <br />
            Two faces.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#a5b4fc,#7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All of you.
            </span>
          </h1>

          <p
            style={{
              fontSize: 14,
              fontWeight: 300,
              color: theme.textMuted,
              lineHeight: 1.75,
              maxWidth: 400,
              margin: "0 0 36px",
              letterSpacing: "0.01em",
            }}
          >
            Discover real developer profiles already built on btouch, then create your own shareable card at{" "}
            <span
              style={{
                color: theme.brandButtonText,
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
              }}
            >
              btouch.dev/you
            </span>{" "}
            with your profile on the front and live stats on the back.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href={dashHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: theme.primaryButtonBg,
                color: theme.primaryButtonText,
                borderRadius: 50,
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Build your card →
            </Link>
            <Link
              href="/demo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: theme.secondaryButtonBg,
                color: theme.secondaryButtonText,
                borderRadius: 50,
                padding: "13px 20px",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                border: `0.5px solid ${theme.secondaryButtonBorder}`,
                whiteSpace: "nowrap",
              }}
            >
              View demo card
            </Link>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 8.5,
                color: theme.textFaint,
                letterSpacing: "0.1em",
                lineHeight: 1.6,
              }}
            >
              free
              <br />
              2 minutes
            </span>
          </div>
        </div>

        <div
          className="right-col"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 52px",
            gap: 0,
            minHeight: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8.5,
              color: theme.textFaint,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            identity of the day
          </div>

          <div
            style={{
              marginBottom: 26,
              borderRadius: 18,
              border: `0.5px solid ${theme.panelBorder}`,
              background: theme.panelGradient,
              padding: "22px 22px 18px",
              boxShadow: uiTheme === "dark" ? "0 24px 80px rgba(0,0,0,0.22)" : "0 18px 48px rgba(15,23,42,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                color: theme.textStrong,
                letterSpacing: "-0.02em",
                marginBottom: 18,
              }}
            >
              “{quote}”
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: theme.textFaint,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              refreshes daily · {dateLabel}
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8.5,
              color: theme.textFaint,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            developers on btouch
          </div>

          <div
            className="directory-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              maxHeight: "52vh",
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
            {users.length > 0 ? users.map((user) => (
              <div
                key={user.username}
                style={{
                  background: theme.cardBg,
                  border: `0.5px solid ${theme.cardBorder}`,
                  borderRadius: 16,
                  padding: "16px",
                }}
              >
                <Link href={`/${user.username}`} style={{ display: "block" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: user.avatarUrl
                          ? `center / cover no-repeat url(${user.avatarUrl})`
                          : "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(124,58,237,0.7))",
                        border: `0.5px solid ${theme.cardBorder}`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: theme.textStrong,
                          letterSpacing: "-0.02em",
                          marginBottom: 2,
                          lineHeight: 1.2,
                        }}
                      >
                        {user.displayName}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 10,
                          color: theme.brandButtonText,
                          letterSpacing: "0.04em",
                        }}
                      >
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: theme.textStrong,
                      lineHeight: 1.45,
                      marginBottom: 8,
                      minHeight: 36,
                    }}
                  >
                    {user.tagline || user.headline || "Developer identity in progress."}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: theme.textSoft,
                      lineHeight: 1.5,
                      marginBottom: 12,
                      minHeight: 16,
                    }}
                  >
                    {user.location || "Location not shared"}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {user.skills.length > 0 ? user.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "5px 9px",
                          borderRadius: 999,
                          background: theme.pillBg,
                          border: `0.5px solid ${theme.pillBorder}`,
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: theme.brandButtonText,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {skill}
                      </span>
                    )) : (
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: theme.textFaint,
                          letterSpacing: "0.06em",
                        }}
                      >
                        open profile →
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            )) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  borderRadius: 16,
                  border: `0.5px solid ${theme.panelBorder}`,
                  background: theme.panelBg,
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: theme.textStrong,
                    marginBottom: 8,
                  }}
                >
                  No public users yet.
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.emptyStateText,
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  Create the first btouch profile and it will appear here instead of the demo card.
                </div>
                <Link
                  href={dashHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: theme.brandButtonBg,
                    border: `0.5px solid ${theme.brandButtonBorder}`,
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: theme.brandButtonText,
                    letterSpacing: "0.06em",
                  }}
                >
                  create first profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer
        className="page-footer"
        style={{
          height: 48,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 48px",
          borderTop: `0.5px solid ${theme.footerBorder}`,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: theme.textFaint,
              letterSpacing: "0.08em",
            }}
          >
            btouch · dev identity card
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            href="/demo"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: theme.textFaint,
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            see example
          </Link>
          <Link
            href={dashHref}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: theme.brandButtonText,
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            {isAuthed ? "my card" : "get started"}
          </Link>
        </div>
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Space Mono', monospace",
            fontSize: 8.5,
            color: theme.textFaint,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          © {new Date().getFullYear()} btouch. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
