import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
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
              developer identity card
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
            Connect LinkedIn and your coding platforms. Get a shareable flip card at{" "}
            <span
              style={{
                color: "rgba(165,180,252,0.92)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
              }}
            >
              btouch.dev/you
            </span>{" "}
            - profile on the front, live stats on the back.
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
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8.5,
              color: "rgba(255,255,255,0.46)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            what you get
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 26 }}>
            {[
              {
                num: "01",
                title: "LinkedIn front face",
                desc: "Name, headline, bio and experience - clean and professional.",
                color: "#a78bfa",
              },
              {
                num: "02",
                title: "Live coding stats back",
                desc: "GitHub, LeetCode, Codeforces, GFG - fetched live with heatmap.",
                color: "#f89f1b",
              },
              {
                num: "03",
                title: "Shareable forever",
                desc: "One URL that updates automatically when your stats change.",
                color: "#2ecc71",
              },
            ].map((f, i) => (
              <div
                key={f.number}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    color: f.color,
                    opacity: 0.55,
                    letterSpacing: "0.04em",
                    paddingTop: 2,
                  }}
                >
                  {f.num}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#e8eaf6",
                      letterSpacing: "-0.01em",
                      marginBottom: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.56)",
                      lineHeight: 1.55,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
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
            how it works
          </div>

          <div
            className="how-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {[
              { step: "1", title: "Sign in", desc: "One click with GitHub." },
              { step: "2", title: "Add links", desc: "LinkedIn + platform handles." },
              { step: "3", title: "Share", desc: "Your card is live instantly." },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "14px 14px",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: "rgba(99,102,241,0.1)",
                    border: "0.5px solid rgba(99,102,241,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(165,180,252,0.88)",
                    marginBottom: 10,
                  }}
                >
                  {s.step}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#e8eaf6",
                    letterSpacing: "-0.01em",
                    marginBottom: 5,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.54)",
                    lineHeight: 1.5,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
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
