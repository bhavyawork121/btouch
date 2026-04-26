import Link from "next/link";
import { auth } from "@/lib/auth";
import { getHomepageUsers, getIdentityQuoteOfDay } from "@/lib/homepage";

export default async function HomePage() {
  const session = await auth();
  const users = await getHomepageUsers();
  const { quote, dateLabel } = getIdentityQuoteOfDay();
  const isAuthed = !!session?.user;
  const dashHref = isAuthed ? "/dashboard" : "/auth?callbackUrl=/dashboard";

  return (
    <div
      className="page-wrapper page-enter"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#07080f",
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99,102,241,0.1) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 30%, rgba(124,58,237,0.06) 0%, transparent 50%)
        `,
        display: "grid",
        gridTemplateRows: "56px minmax(0, 1fr) 48px",
        fontFamily: "'Space Grotesk', sans-serif",
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
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
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
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.04em",
            }}
          >
            btouch
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#c7d2fe",
              textDecoration: "none",
              letterSpacing: "0.08em",
              padding: "7px 14px",
              borderRadius: 999,
              border: "0.5px solid rgba(99,102,241,0.28)",
              background: "rgba(99,102,241,0.12)",
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
              background: "rgba(99,102,241,0.14)",
              border: "0.5px solid rgba(99,102,241,0.32)",
              borderRadius: 7,
              padding: "7px 16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "#a5b4fc",
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
            borderRight: "0.5px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.09)",
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
                color: "rgba(255,255,255,0.6)",
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
              color: "#ffffff",
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
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.75,
              maxWidth: 400,
              margin: "0 0 36px",
              letterSpacing: "0.01em",
            }}
          >
            Discover real developer profiles already built on btouch, then create your own shareable card at{" "}
            <span
              style={{
                color: "rgba(165,180,252,0.92)",
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
                background: "#ffffff",
                color: "#07080f",
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
                background: "transparent",
                color: "rgba(255,255,255,0.72)",
                borderRadius: 50,
                padding: "13px 20px",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                border: "0.5px solid rgba(255,255,255,0.12)",
                whiteSpace: "nowrap",
              }}
            >
              View demo card
            </Link>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 8.5,
                color: "rgba(255,255,255,0.48)",
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
              color: "rgba(255,255,255,0.46)",
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
              border: "0.5px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              padding: "22px 22px 18px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            }}
          >
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                color: "#f8fafc",
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
                color: "rgba(255,255,255,0.45)",
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
              color: "rgba(255,255,255,0.46)",
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
                  background: "rgba(255,255,255,0.025)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
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
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#f8fafc",
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
                          color: "#a5b4fc",
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
                      color: "#e2e8f0",
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
                      color: "rgba(255,255,255,0.52)",
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
                          background: "rgba(99,102,241,0.12)",
                          border: "0.5px solid rgba(99,102,241,0.24)",
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          color: "#c7d2fe",
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
                          color: "rgba(255,255,255,0.38)",
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
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f8fafc",
                    marginBottom: 8,
                  }}
                >
                  No public users yet.
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.58)",
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
                    background: "rgba(99,102,241,0.14)",
                    border: "0.5px solid rgba(99,102,241,0.32)",
                    borderRadius: 999,
                    padding: "10px 16px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: "#a5b4fc",
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
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
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
              color: "rgba(255,255,255,0.45)",
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
            color: "rgba(255,255,255,0.45)",
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
              color: "rgba(165,180,252,0.78)",
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
            color: "rgba(255,255,255,0.44)",
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
