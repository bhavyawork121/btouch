"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { resolveAccent, resolveTheme } from "@/lib/theme";
import type { CardData } from "@/types/card";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

const springConfig = { stiffness: 260, damping: 20, mass: 1.2 };

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface HeatmapDay {
  date: string;
  count: number;
}

type ViewMode = "compact" | "full";
type PlatformKey = "all" | "github" | "leetcode" | "codeforces" | "gfg";

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("a, button, input, textarea, select, [data-prevent-card-flip='true']"))
    : false;
}

export function FlipCard({ data, username }: { data: CardData; username: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [frontScrollIndex, setFrontScrollIndex] = useState(0);
  const [backScrollIndex, setBackScrollIndex] = useState(0);
  const [showFlipHint, setShowFlipHint] = useState(true);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    data.appearance.theme === "light" ? "light" : "dark",
  );
  const [sceneSize, setSceneSize] = useState({ width: 400, height: 240 });
  const [fullHeight, setFullHeight] = useState(0);
  const stretchedRef = useRef<HTMLDivElement | null>(null);
  const stretchedFrontRef = useRef<HTMLDivElement | null>(null);
  const stretchedBackRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const particleId = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setResolvedTheme(resolveTheme(data.appearance.theme, mediaQuery.matches));
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [data.appearance.theme]);

  useEffect(() => {
    const updateSceneSize = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= 480) {
        const width = Math.max(240, viewportWidth - 32);
        setSceneSize({ width, height: width / 1.6667 });
        return;
      }

      setSceneSize({ width: 400, height: 240 });
    };

    updateSceneSize();
    window.addEventListener("resize", updateSceneSize);
    return () => window.removeEventListener("resize", updateSceneSize);
  }, []);

  useEffect(() => {
    if (viewMode !== "full") {
      return;
    }

    const updateHeight = () => {
      const nextHeight = Math.max(
        stretchedFrontRef.current?.offsetHeight ?? 0,
        stretchedBackRef.current?.offsetHeight ?? 0,
      );

      if (nextHeight > 0) {
        setFullHeight(nextHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [viewMode, data]);

  useEffect(() => {
    if (viewMode === "full") {
      setIsFlipped(false);
      setIsLocked(false);
    }
  }, [viewMode]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowFlipHint(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const glowStyle = useMemo(
    () => ({
      background:
        "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--card-accent-rgb),0.12) 0%, transparent 60%)",
    }),
    [],
  );

  const accent = useMemo(() => resolveAccent(data.appearance.accentColor), [data.appearance.accentColor]);
  const cardStyle = useMemo(
    () =>
      resolvedTheme === "light"
        ? ({
            "--card-accent": accent.hex,
            "--card-accent-rgb": accent.rgb,
            "--card-surface": "rgba(255,255,255,0.86)",
            "--card-surface-alt": "rgba(244,248,255,0.96)",
            "--card-border": "rgba(15,23,42,0.10)",
          } as React.CSSProperties)
        : ({
            "--card-accent": accent.hex,
            "--card-accent-rgb": accent.rgb,
            "--card-surface": "rgba(10,14,22,0.86)",
            "--card-surface-alt": "rgba(18,23,34,0.96)",
            "--card-border": "rgba(255,255,255,0.10)",
          } as React.CSSProperties),
    [accent, resolvedTheme],
  );

  const spawnParticles = useCallback(() => {
    const nextParticles = Array.from({ length: 7 }, (_, index) => ({
      id: particleId.current + index,
      x: 50,
      y: 50,
      dx: Math.random() * 80 - 40,
      dy: Math.random() * 80 - 40,
    }));
    particleId.current += nextParticles.length;
    setParticles(nextParticles);
    window.setTimeout(() => setParticles([]), 420);
  }, []);

  const flip = useCallback(
    (locked: boolean) => {
      setIsFlipped((prev) => {
        const next = locked ? !prev : true;
        if (prev !== next) {
          spawnParticles();
        }
        return next;
      });
    },
    [spawnParticles],
  );

  const resetHover = useCallback(() => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const toggleFlipLock = useCallback(() => {
    setIsLocked((prev) => !prev);
    flip(true);
  }, [flip]);

  const handleCardTap = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      toggleFlipLock();
    },
    [toggleFlipLock],
  );

  const activeScrollIndex = isFlipped ? backScrollIndex : frontScrollIndex;
  const fullWidth = Math.min(600, Math.max(320, sceneSize.width + 120));

  return (
    <div className="relative flex flex-col items-center gap-4">
      {viewMode === "compact" ? (
        <>
          <div
            data-btouch-theme={resolvedTheme}
            aria-label={`Flip card for ${username}`}
            style={{ ...cardStyle, width: sceneSize.width, height: sceneSize.height, perspective: 1200, flexShrink: 0 }}
            role="button"
            tabIndex={0}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = `${((event.clientX - rect.left) / rect.width) * 100}%`;
              const y = `${((event.clientY - rect.top) / rect.height) * 100}%`;
              event.currentTarget.style.setProperty("--mouse-x", x);
              event.currentTarget.style.setProperty("--mouse-y", y);
            }}
            onMouseEnter={() => {
              if (isLocked) {
                return;
              }
              resetHover();
              hoverTimer.current = window.setTimeout(() => flip(false), 300);
            }}
            onMouseLeave={() => {
              resetHover();
              if (!isLocked) {
                setIsFlipped(false);
              }
            }}
            onClick={handleCardTap}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") {
                return;
              }

              event.preventDefault();
              toggleFlipLock();
            }}
            className="group relative outline-none"
          >
            <div className="absolute inset-0 rounded-[18px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={glowStyle} />
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", ...springConfig }}
              className="relative shadow-card"
              style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 18,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <CardFront
                  data={data}
                  onScrollIndexChange={setFrontScrollIndex}
                />
                {!isFlipped && showFlipHint ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(13,17,23,0.95))",
                      borderRadius: "0 0 18px 18px",
                      padding: "16px 16px 10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                      pointerEvents: "none",
                      animation: "fadeOutHint 1s ease-out 3s forwards",
                      zIndex: 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: 9,
                        color: "rgba(165,180,252,0.5)",
                        letterSpacing: "0.1em",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>↻</span>
                      tap to flip for coding stats
                    </span>
                  </div>
                ) : null}
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 18,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <CardBack data={data} onScrollIndexChange={setBackScrollIndex} />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  initial={{ opacity: 0.8, x: particle.x, y: particle.y, scale: 0.8 }}
                  animate={{ opacity: 0, x: particle.x + particle.dx, y: particle.y + particle.dy, scale: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none absolute left-0 top-0 h-2 w-2 rounded-full bg-white/80"
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: 3 }, (_, index) => {
              const isActive = index === activeScrollIndex;
              return (
                <div
                  key={index}
                  style={{
                    width: isActive ? 16 : 6,
                    height: 3,
                    borderRadius: 2,
                    background: isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                    transition: "all .3s",
                  }}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div
          ref={stretchedRef}
          data-btouch-theme={resolvedTheme}
          data-btouch-full="true"
          aria-label={`Flip full card for ${username}`}
          style={{
            ...cardStyle,
            width: fullWidth,
            height: fullHeight || "auto",
            perspective: 1200,
            flexShrink: 0,
          }}
          role="button"
          tabIndex={0}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = `${((event.clientX - rect.left) / rect.width) * 100}%`;
            const y = `${((event.clientY - rect.top) / rect.height) * 100}%`;
            event.currentTarget.style.setProperty("--mouse-x", x);
            event.currentTarget.style.setProperty("--mouse-y", y);
          }}
          onMouseEnter={() => {
            if (isLocked) {
              return;
            }
            resetHover();
            hoverTimer.current = window.setTimeout(() => flip(false), 300);
          }}
          onMouseLeave={() => {
            resetHover();
            if (!isLocked) {
              setIsFlipped(false);
            }
          }}
          onClick={handleCardTap}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }

            event.preventDefault();
            toggleFlipLock();
          }}
          className="group relative outline-none"
        >
          <div className="absolute inset-0 rounded-[18px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={glowStyle} />
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", ...springConfig }}
            className="relative shadow-card"
            style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                borderRadius: 18,
                overflow: "hidden",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                background: "#0d1117",
                border: "0.5px solid rgba(255,255,255,0.08)",
                boxSizing: "border-box",
                boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.04)",
              }}
            >
              <div ref={stretchedFrontRef} style={{ width: "100%", padding: "16px 18px 18px", boxSizing: "border-box" }}>
                <StretchedFrontContent data={data} handle={username} />
              </div>
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                borderRadius: 18,
                overflow: "hidden",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "#08090e",
                border: "0.5px solid rgba(255,255,255,0.06)",
                boxSizing: "border-box",
                boxShadow: "0 0 0 0.5px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(167,139,250,0.03)",
              }}
            >
              <div ref={stretchedBackRef} style={{ width: "100%", padding: "16px 18px 18px", boxSizing: "border-box" }}>
                <StretchedBackContent data={data} />
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                initial={{ opacity: 0.8, x: particle.x, y: particle.y, scale: 0.8 }}
                animate={{ opacity: 0, x: particle.x + particle.dx, y: particle.y + particle.dy, scale: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="pointer-events-none absolute left-0 top-0 h-2 w-2 rounded-full bg-white/80"
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.09)",
          borderRadius: 24,
          padding: "4px 5px",
          marginTop: 14,
        }}
      >
        {(["compact", "full"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            style={{
              padding: "5px 16px",
              borderRadius: 18,
              border: viewMode === mode ? "0.5px solid rgba(99,102,241,0.45)" : "0.5px solid transparent",
              background: viewMode === mode ? "rgba(99,102,241,0.22)" : "transparent",
              color: viewMode === mode ? "#a5b4fc" : "rgba(255,255,255,0.28)",
              fontSize: 11,
              fontFamily: "var(--font-space-mono)",
              letterSpacing: "0.09em",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {mode === "compact" ? "compact" : "full view"}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes heatmapFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOutHint {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        [data-btouch-full="true"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function StretchedFrontContent({
  data,
  handle,
}: {
  data: CardData;
  handle: string;
}) {
  const experience = buildExperienceTimeline(data);
  const initials = getInitials(data.profile.displayName);
  const linkedInHandle = (data.profile.linkedinUrl ?? "linkedin").replace("https://www.linkedin.com/in/", "");
  const monoFont = "var(--font-space-mono)";
  const groteskFont = "var(--font-space-grotesk)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ minWidth: 52 }}>
          <Avatar src={data.profile.avatarUrl} alt={data.profile.displayName || initials} size={52} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: groteskFont,
              fontSize: 17,
              fontWeight: 700,
              color: "#f0f4ff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 5,
            }}
          >
            {data.profile.displayName || initials}
          </div>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: 3,
              maxWidth: "100%",
            }}
          >
            {data.profile.headline}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(10,102,194,0.08)",
              border: "0.5px solid rgba(10,102,194,0.22)",
              borderRadius: 20,
              padding: "2px 9px",
              marginTop: 5,
              fontFamily: monoFont,
              fontSize: 9,
              color: "#3d6a8a",
              letterSpacing: "0.04em",
              width: "fit-content",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#0A66C2", fontSize: 10 }}>in</span>
            {linkedInHandle}
          </div>
        </div>
        {data.profile.linkedinUrl ? (
          <a
            href={data.profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              background: "rgba(255,255,255,.06)",
              border: "0.5px solid rgba(255,255,255,.12)",
              borderRadius: 6,
              padding: "5px 12px",
              fontFamily: monoFont,
              fontSize: 9,
              color: "rgba(255,255,255,.45)",
              letterSpacing: "0.08em",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            live profile
          </a>
        ) : null}
      </div>

      <div style={{ height: "0.5px", background: "rgba(255,255,255,.07)", marginBottom: 12 }} />
      <div
        style={{
          fontFamily: groteskFont,
          fontWeight: 300,
          fontSize: 11,
          color: "rgba(255,255,255,0.38)",
          lineHeight: 1.65,
          letterSpacing: "0.01em",
          marginBottom: 12,
          maxWidth: 540,
        }}
      >
        {data.profile.bio}
      </div>

      <div
        style={{
          fontFamily: monoFont,
          fontSize: 8,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,.15)",
          textTransform: "uppercase",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>experience</span>
        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,.06)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {experience.map((exp, index) => (
          <div key={`${exp.role}-${exp.company}-${index}`} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 3 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: index === 0 ? "#6366f1" : "rgba(255,255,255,.15)",
                  border: index === 0 ? "2px solid rgba(99,102,241,.4)" : "1px solid rgba(255,255,255,.1)",
                }}
              />
              {index < experience.length - 1 ? (
                <div style={{ width: "0.5px", flex: 1, minHeight: 12, marginTop: 4, background: "rgba(255,255,255,.08)" }} />
              ) : null}
            </div>

            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, gap: 6 }}>
                <div>
                  <div
                    style={{
                      fontFamily: groteskFont,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#d4e4f7",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {exp.role}
                  </div>
                  <div
                    style={{
                      fontFamily: monoFont,
                      fontSize: 10,
                      color: "#f89f1b",
                      letterSpacing: "0.03em",
                      marginTop: 2,
                    }}
                  >
                    {exp.company}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: monoFont,
                    fontSize: 9,
                    color: "rgba(255,255,255,.2)",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    marginTop: 2,
                  }}
                >
                  {exp.duration}
                </div>
              </div>
              {exp.description && exp.description !== data.profile.bio ? (
                <div
                  style={{
                    fontFamily: groteskFont,
                    fontWeight: 300,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.6,
                    marginTop: 5,
                    maxWidth: 500,
                  }}
                >
                  {exp.description.slice(0, 120)}
                  {exp.description.length > 120 ? "..." : ""}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          paddingTop: 12,
          marginTop: 14,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <div>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              btouch
            </div>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 7,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.08em",
                marginTop: 1.5,
              }}
            >
              dev identity card
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: monoFont,
            fontSize: 8.5,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
            flex: 1,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          btouch.dev/{handle}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(99,102,241,0.08)",
            border: "0.5px solid rgba(99,102,241,0.25)",
            borderRadius: 6,
            padding: "5px 11px",
            fontFamily: monoFont,
            fontSize: 9,
            color: "rgba(165,180,252,0.65)",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span>↻</span>
          tap to flip
        </div>
      </div>
    </div>
  );
}

function StretchedBackContent({ data }: { data: CardData }) {
  const stats = getFullStatsView(data);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>("all");
  const [hoveredDot, setHoveredDot] = useState<{ index: number; date: string; count: number } | null>(null);
  const monoFont = "var(--font-space-mono)";
  const groteskFont = "var(--font-space-grotesk)";
  const active = stats.platformConfig[activePlatform];
  const totalContribs = active.data.reduce((sum, day) => sum + day.count, 0);
  const activeDays = active.data.filter((day) => day.count > 0).length;
  const maxDay = active.data.reduce(
    (max, day) => (day.count > max.count ? day : max),
    { date: active.data[0]?.date ?? "", count: 0 },
  );
  const maxCount = Math.max(...active.data.map((day) => day.count), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.18em", color: "#1e3a50" }}>{"// coding stats"}</span>
        <span style={{ fontFamily: monoFont, fontSize: 8, color: "#1a5c38", letterSpacing: "0.06em" }}>@{stats.handle}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
        {stats.platformCards.map((platform) => (
          <button
            key={platform.key}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActivePlatform(platform.platform);
              setHoveredDot(null);
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              borderRadius: 10,
              padding: "10px 12px",
              background: activePlatform === platform.platform ? `rgba(${platform.rgb}, 0.06)` : "rgba(255,255,255,0.025)",
              border: activePlatform === platform.platform ? `0.5px solid rgba(${platform.rgb}, 0.2)` : "0.5px solid rgba(255,255,255,0.06)",
              borderLeft: activePlatform === platform.platform ? `2px solid ${platform.color}` : "0.5px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s",
              textAlign: "left",
            }}
          >
            <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.14em", color: platform.color, opacity: 0.8, marginBottom: 4 }}>
              {platform.key}
            </div>
            <div style={{ fontFamily: groteskFont, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: platform.color, lineHeight: 1, marginBottom: 4 }}>
              {platform.value}
            </div>
            <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,.25)", letterSpacing: "0.06em" }}>{platform.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "stretch" }}>
        <div
          style={{
            flex: 1,
            minHeight: 80,
            borderRadius: 10,
            padding: "12px 14px",
            background: "rgba(255,255,255,.025)",
            border: "0.5px solid rgba(255,255,255,.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.12em", color: "rgba(248,159,27,.45)", marginBottom: 3 }}>
              DAY STREAK
            </div>
            <div style={{ fontFamily: groteskFont, fontSize: 22, fontWeight: 700, color: "#f89f1b", lineHeight: 1 }}>{stats.streak}</div>
          </div>
          <span style={{ fontSize: 18 }}>🔥</span>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 80,
            borderRadius: 10,
            padding: "12px 14px",
            background: "rgba(255,255,255,.025)",
            border: "0.5px solid rgba(255,255,255,.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.12em", color: "rgba(248,159,27,.45)", marginBottom: 3 }}>
            LEETCODE RANK
          </div>
          <div style={{ fontFamily: groteskFont, fontSize: 18, fontWeight: 700, color: "#f89f1b", lineHeight: 1, marginBottom: 3 }}>{stats.rank}</div>
          <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,.25)", letterSpacing: "0.06em" }}>global</div>
        </div>
      </div>

      <div
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        style={{
          borderRadius: 10,
          padding: "10px 12px",
          background: "rgba(255,255,255,.025)",
          border: "0.5px solid rgba(255,255,255,.07)",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
          {(["all", "github", "leetcode", "codeforces", "gfg"] as const).map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActivePlatform(platform);
                setHoveredDot(null);
              }}
              style={{
                fontFamily: monoFont,
                fontSize: 8.5,
                letterSpacing: "0.1em",
                padding: "4px 12px",
                borderRadius: 6,
                border: "0.5px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activePlatform === platform ? `rgba(${stats.platformConfig[platform].rgb},0.12)` : "transparent",
                borderColor: activePlatform === platform ? `rgba(${stats.platformConfig[platform].rgb},0.35)` : "rgba(255,255,255,0.08)",
                color: activePlatform === platform ? stats.platformConfig[platform].color : "rgba(255,255,255,0.22)",
                borderLeft: activePlatform === platform ? `2px solid ${stats.platformConfig[platform].color}` : "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              {platform === "all" ? "all" : platform}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.14em", color: active.color, opacity: 0.75 }}>
            {active.label}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,0.2)" }}>last 91 days</div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: monoFont, fontSize: 8.5, color: "rgba(255,255,255,0.22)", letterSpacing: "0.04em", lineHeight: 1.7 }}>
            <span style={{ color: active.color, fontWeight: 700 }}>{totalContribs}</span>
            {" contributions · "}
            <span style={{ color: active.color }}>{activeDays}</span>
            {" active days"}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 8.5, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>
            {"peak "}
            <span style={{ color: active.color }}>{maxDay.count}</span>
            {" contributions on "}
            {maxDay.date}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div key={activePlatform} className="heatmap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 2.5, width: "100%", animation: "heatmapFade 0.3s ease-out" }}>
            {active.data.map((day, index) => {
              const intensity = maxCount > 0 ? day.count / maxCount : 0;
              const opacity = day.count === 0 ? 0.07 : 0.2 + intensity * 0.8;

              return (
                <div
                  key={`${activePlatform}-${day.date}-${index}`}
                  onMouseEnter={(event) => {
                    event.stopPropagation();
                    setHoveredDot({ index, date: day.date, count: day.count });
                  }}
                  onMouseLeave={() => setHoveredDot(null)}
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    aspectRatio: "1 / 1",
                    width: "100%",
                    height: "auto",
                    borderRadius: 1.5,
                    background: `rgba(${active.rgb},${opacity.toFixed(2)})`,
                    cursor: day.count > 0 ? "pointer" : "default",
                    transition: "transform 0.1s, outline 0.1s",
                    transform: hoveredDot?.index === index ? "scale(1.3)" : "scale(1)",
                    outline: hoveredDot?.index === index ? `1px solid rgba(${active.rgb},0.6)` : "none",
                  }}
                />
              );
            })}
          </div>

          {hoveredDot ? (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                left: `${Math.min(Math.max((hoveredDot.index % 13) * (100 / 13), 8), 80)}%`,
                transform: "translateX(-50%)",
                background: "#1a1f2e",
                border: `0.5px solid rgba(${active.rgb},0.35)`,
                borderRadius: 6,
                padding: "6px 10px",
                whiteSpace: "nowrap",
                zIndex: 20,
                pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontFamily: monoFont, fontSize: 8.5, color: `rgba(${active.rgb},0.7)`, letterSpacing: "0.06em", marginBottom: 3 }}>
                {hoveredDot.date}
              </div>
              <div style={{ fontFamily: groteskFont, fontSize: 14, fontWeight: 700, color: "#f0f4ff", lineHeight: 1 }}>
                {hoveredDot.count > 0 ? `${hoveredDot.count} contribution${hoveredDot.count > 1 ? "s" : ""}` : "no activity"}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderTop: `4px solid rgba(${active.rgb},0.35)`,
                }}
              />
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "flex-end" }}>
          <span style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,.2)", marginRight: 4 }}>less</span>
          {[0.07, 0.25, 0.5, 0.75, 1].map((opacity, index) => (
            <div key={index} style={{ width: 9, height: 9, borderRadius: 2, background: `rgba(${active.rgb},${opacity})` }} />
          ))}
          <span style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,.2)", marginLeft: 4 }}>more</span>
        </div>
      </div>

      <BtouchFooter side="back" handle={stats.handle} rankPill="top 7% · lc" />
    </div>
  );
}

function BtouchFooter({ side, handle, rankPill }: { side: "front" | "back"; handle: string; rankPill?: string }) {
  const monoFont = "var(--font-space-mono)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
        paddingTop: 10,
        marginTop: 6,
        flexWrap: "nowrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
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
          <span style={{ fontFamily: monoFont, fontSize: 8, fontWeight: 700, color: "#fff" }}>b</span>
        </div>
        <span
          style={{
            fontFamily: monoFont,
            fontSize: 9,
            fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          btouch
        </span>
      </div>

      {side === "back" ? (
        <span
          style={{
            fontFamily: monoFont,
            fontSize: 7.5,
            color: "rgba(255,255,255,0.1)",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            flexShrink: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          one card · all of you
        </span>
      ) : (
        <span style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>btouch.dev/{handle}</span>
      )}

      {side === "back" ? (
        <div
          style={{
            fontFamily: monoFont,
            fontSize: 8.5,
            background: "rgba(248,159,27,0.08)",
            border: "0.5px solid rgba(248,159,27,0.2)",
            color: "rgba(248,159,27,0.75)",
            padding: "3px 9px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {rankPill ?? "top 7% · lc"}
        </div>
      ) : null}
    </div>
  );
}

function buildExperienceTimeline(data: CardData) {
  const role = data.profile.currentRole ?? "Software Engineer";
  const company = data.profile.currentCompany ?? "Independent";

  return [
    {
      role,
      company,
      duration: "Now",
      description: "Currently building developer-facing interfaces and systems.",
    },
    {
      role: "Builder",
      company: "btouch",
      duration: "Ongoing",
      description: "Designing a shareable developer identity card with motion, public profile surfaces, and live coding stats.",
    },
  ];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function normalizeHeatmap(source: number[] | undefined) {
  const fallback = Array.from({ length: 91 }, (_, index) => index % 5);
  const heatmap = source && source.length > 0 ? source : fallback;

  return Array.from({ length: 91 }, (_, index) => {
    const raw = heatmap[index % heatmap.length] ?? 0;
    return Math.max(0, Math.min(4, raw));
  });
}

function buildContributionSeries(levels: number[], scale: number, seedOffset: number): HeatmapDay[] {
  return Array.from({ length: 91 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (90 - index));
    const base = levels[index % levels.length] ?? 0;
    const count = Math.max(0, Math.round(base * scale + ((index + seedOffset) % 3 === 0 ? 1 : 0)));

    return {
      date: date.toISOString().slice(0, 10),
      count,
    };
  });
}

function getFullStatsView(data: CardData) {
  const github = data.stats.github;
  const leetcode = data.stats.leetcode;
  const codeforces = data.stats.codeforces;
  const gfg = data.stats.gfg;
  const githubData = buildContributionSeries(normalizeHeatmap(github?.heatmap), 1, 1);
  const leetcodeData = buildContributionSeries(normalizeHeatmap(github?.heatmap), 0.8, 2);
  const codeforcesData = buildContributionSeries(normalizeHeatmap(github?.heatmap), 0.65, 3);
  const gfgData = buildContributionSeries(normalizeHeatmap(github?.heatmap), 0.55, 4);
  const combinedData = Array.from({ length: 91 }, (_, index) => ({
    date: githubData[index]?.date ?? "",
    count:
      (githubData[index]?.count ?? 0) +
      (leetcodeData[index]?.count ?? 0) +
      (codeforcesData[index]?.count ?? 0) +
      (gfgData[index]?.count ?? 0),
  }));

  return {
    handle: github?.handle ?? leetcode?.handle ?? codeforces?.handle ?? gfg?.handle ?? "btouch",
    streak: leetcode?.streak ?? gfg?.streak ?? 0,
    rank:
      leetcode?.ranking !== null && leetcode?.ranking !== undefined
        ? `#${leetcode.ranking.toLocaleString()}`
        : codeforces?.rank ?? "Unranked",
    platformCards: [
      { key: "GITHUB", value: (github?.followers ?? 0).toLocaleString(), label: "followers", color: "#a78bfa", platform: "github" as const, rgb: "167,139,250" },
      { key: "LEETCODE", value: (leetcode?.solved.total ?? 0).toLocaleString(), label: "problems solved", color: "#f89f1b", platform: "leetcode" as const, rgb: "248,159,27" },
      { key: "CODEFORCES", value: (codeforces?.rating ?? 0).toLocaleString(), label: "current rating", color: "#5b8dd4", platform: "codeforces" as const, rgb: "91,141,212" },
      { key: "GFG", value: (gfg?.score ?? 0).toLocaleString(), label: "practice score", color: "#2ecc71", platform: "gfg" as const, rgb: "46,204,113" },
    ],
    platformConfig: {
      all: { label: "ALL CONTRIBUTIONS", color: "#a78bfa", rgb: "167,139,250", data: combinedData },
      github: { label: "GITHUB COMMITS", color: "#a78bfa", rgb: "167,139,250", data: githubData },
      leetcode: { label: "LEETCODE SUBMISSIONS", color: "#f89f1b", rgb: "248,159,27", data: leetcodeData },
      codeforces: { label: "CODEFORCES SUBMISSIONS", color: "#5b8dd4", rgb: "91,141,212", data: codeforcesData },
      gfg: { label: "GFG SUBMISSIONS", color: "#2ecc71", rgb: "46,204,113", data: gfgData },
    } satisfies Record<PlatformKey, { label: string; color: string; rgb: string; data: HeatmapDay[] }>,
  };
}
