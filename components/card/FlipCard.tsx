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
type PlatformName = "github" | "leetcode" | "codeforces" | "gfg";
type PlatformKey = "all" | PlatformName;

const PLATFORM_META: Record<PlatformName, { label: string; color: string; rgb: string }> = {
  github: { label: "gh", color: "#a78bfa", rgb: "167,139,250" },
  leetcode: { label: "lc", color: "#f89f1b", rgb: "248,159,27" },
  codeforces: { label: "cf", color: "#5b8dd4", rgb: "91,141,212" },
  gfg: { label: "gfg", color: "#2ecc71", rgb: "46,204,113" },
};

const HEATMAP_DAYS = 91;
const FLIP_PARTICLE_COUNT = 8;

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("a, button, input, textarea, select, [data-prevent-card-flip='true']"))
    : false;
}

export function FlipCard({ data, username }: { data: CardData; username: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [isFlipped, setIsFlipped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [frontScrollIndex, setFrontScrollIndex] = useState(0);
  const [backScrollIndex, setBackScrollIndex] = useState(0);
  const [showFlipHint, setShowFlipHint] = useState(false);
  const [hasTappedCard, setHasTappedCard] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(
    data.appearance.theme === "light" ? "light" : "dark",
  );
  const [sceneSize, setSceneSize] = useState({ width: 400, height: 240 });
  const [fullHeight, setFullHeight] = useState(0);
  const stretchedRef = useRef<HTMLDivElement | null>(null);
  const stretchedFrontRef = useRef<HTMLDivElement | null>(null);
  const stretchedBackRef = useRef<HTMLDivElement | null>(null);
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
    }
  }, [viewMode]);

  useEffect(() => {
    if (hasTappedCard) {
      setShowFlipHint(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setShowFlipHint(true), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [hasTappedCard]);

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
    const nextParticles = Array.from({ length: FLIP_PARTICLE_COUNT }, (_, index) => ({
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

  const toggleFlipLock = useCallback(() => {
    if (!hasTappedCard) {
      setHasTappedCard(true);
      setShowFlipHint(false);
    }

    flip(true);
  }, [flip, hasTappedCard]);

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
  const fullWidth = "100%";

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
            maxWidth: 580,
            minWidth: 320,
            margin: "0 auto",
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
              <div ref={stretchedFrontRef} style={{ width: "100%", padding: "24px 28px 22px", boxSizing: "border-box" }}>
                <StretchedFrontContent data={data} handle={username} onFlip={() => setIsFlipped(true)} />
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
              <div ref={stretchedBackRef} style={{ width: "100%", padding: "24px 28px 22px", boxSizing: "border-box" }}>
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

        @keyframes flipHintPulse {
          0%,
          100% {
            opacity: 0.7;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-1px);
          }
        }

        @keyframes spinHint {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(12deg);
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
  onFlip,
}: {
  data: CardData;
  handle: string;
  onFlip?: () => void;
}) {
  const experience = data.profile.experience ?? [];
  const initials = getInitials(data.profile.displayName ?? "");
  const skills = data.profile.skills ?? [];
  const [copied, setCopied] = useState(false);
  const linkedInHandle = (data.profile.linkedinUrl ?? "linkedin")
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
    .replace(/\/$/, "");
  const location = data.profile.location ?? "";
  const monoFont = "var(--font-space-mono)";
  const groteskFont = "var(--font-space-grotesk)";

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const copyUrl = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(`https://btouch.dev/${handle}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
      <div style={{ width: "100%", position: "relative", marginBottom: 16 }}>
        {data.profile.linkedinUrl ? (
          <a
            href={data.profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.09)",
              borderRadius: 6,
              padding: "5px 10px",
              fontFamily: monoFont,
              fontSize: 8.5,
              color: "rgba(255,255,255,0.28)",
              textDecoration: "none",
              letterSpacing: "0.08em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            live profile
            <span style={{ fontSize: 10 }}>↗</span>
          </a>
        ) : null}

        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: data.profile.avatarUrl ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
              border: "2px solid rgba(99,102,241,0.3)",
              outline: "5px solid rgba(99,102,241,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
              fontFamily: groteskFont,
              overflow: "hidden",
            }}
          >
            <Avatar src={data.profile.avatarUrl} alt={data.profile.displayName || initials} size={76} />
          </div>
        </div>

        <div
          style={{
            fontFamily: groteskFont,
            fontSize: 21,
            fontWeight: 700,
            color: "#f0f4ff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          {data.profile.displayName || initials}
        </div>

        <div
          style={{
            fontFamily: monoFont,
            fontSize: 10,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.04em",
            lineHeight: 1.3,
            marginBottom: 10,
            textAlign: "center",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0 40px",
          }}
        >
          {data.profile.headline}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(10,102,194,0.07)",
            border: "0.5px solid rgba(10,102,194,0.18)",
            borderRadius: 20,
            padding: "3px 10px",
            marginBottom: 8,
          }}
        >
          <span style={{ fontFamily: monoFont, fontSize: 8, color: "#0A66C2", fontWeight: 700 }}>in</span>
          <span
            style={{
              fontFamily: monoFont,
              fontSize: 8.5,
              color: "#3d6a8a",
              letterSpacing: "0.02em",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {linkedInHandle}
          </span>
        </div>

        {data.profile.openToWork ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(34,197,94,0.07)",
              border: "0.5px solid rgba(34,197,94,0.2)",
              borderRadius: 20,
              padding: "3px 10px",
              marginBottom: 10,
              fontFamily: monoFont,
              fontSize: 8.5,
              color: "rgba(134,239,172,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#22c55e",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            open to work
          </div>
        ) : null}

        {(location || handle) ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: monoFont,
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            {location ? <span>{location}</span> : null}
            {location && handle ? (
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "inline-block",
                }}
              />
            ) : null}
            {handle ? <span>@ {handle}</span> : null}
          </div>
        ) : null}
      </div>

      <div style={{ width: "100%", height: "0.5px", background: "rgba(255,255,255,0.06)", marginBottom: 18 }} />

      {data.profile.bio ? (
        <div
          style={{
            fontFamily: groteskFont,
            fontWeight: 300,
            fontSize: 12,
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.75,
            letterSpacing: "0.01em",
            textAlign: "left",
            width: "100%",
            marginBottom: 16,
          }}
        >
          {data.profile.bio}
        </div>
      ) : null}

      {skills.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-start", marginBottom: 18, width: "100%" }}>
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              style={{
                fontFamily: monoFont,
                fontSize: 8.5,
                color: index % 3 === 0 ? "rgba(165,180,252,0.65)" : index % 3 === 1 ? "rgba(196,181,253,0.65)" : "rgba(253,186,116,0.65)",
                background:
                  index % 3 === 0
                    ? "rgba(99,102,241,0.07)"
                    : index % 3 === 1
                      ? "rgba(167,139,250,0.07)"
                      : "rgba(248,159,27,0.06)",
                border: "0.5px solid",
                borderColor:
                  index % 3 === 0
                    ? "rgba(99,102,241,0.2)"
                    : index % 3 === 1
                      ? "rgba(167,139,250,0.2)"
                      : "rgba(248,159,27,0.18)",
                borderLeft:
                  index % 3 === 0
                    ? "2px solid rgba(99,102,241,0.6)"
                    : index % 3 === 1
                      ? "2px solid rgba(167,139,250,0.6)"
                      : "2px solid rgba(248,159,27,0.6)",
                borderRadius: 4,
                padding: "3px 9px",
                letterSpacing: "0.05em",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.06)" }} />
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
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {experience.length > 0 ? (
            experience.map((exp, index) => (
            <div key={`${exp.role}-${exp.company}-${index}`} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 4, width: 16 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: index === 0 ? "#6366f1" : "rgba(255,255,255,0.12)",
                    border: index === 0 ? "2px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                />
                {index < experience.length - 1 ? (
                  <div style={{ width: "0.5px", flex: 1, minHeight: 24, background: "rgba(255,255,255,0.06)", marginTop: 4 }} />
                ) : null}
              </div>

              <div style={{ flex: 1, paddingBottom: index < experience.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 3 }}>
                  <div
                    style={{
                      fontFamily: groteskFont,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#d4e4f7",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {exp.role}
                  </div>
                  <div
                    style={{
                      fontFamily: monoFont,
                      fontSize: 8.5,
                      color: "rgba(255,255,255,0.18)",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {exp.duration}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: monoFont,
                    fontSize: 10,
                    color: "#f89f1b",
                    letterSpacing: "0.03em",
                    marginBottom: 5,
                  }}
                >
                  {exp.company}
                </div>

                {exp.description && exp.description !== data.profile.bio ? (
                  <div
                    style={{
                      fontFamily: groteskFont,
                      fontWeight: 300,
                      fontSize: 10.5,
                      color: "rgba(255,255,255,0.26)",
                      lineHeight: 1.65,
                      marginTop: 4,
                    }}
                  >
                    {exp.description.length > 100 ? `${exp.description.slice(0, 100)}...` : exp.description}
                  </div>
                ) : null}
              </div>
            </div>
            ))
          ) : (
            <div
              style={{
                padding: "12px 0",
                textAlign: "center",
                fontFamily: monoFont,
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
              }}
            >
              no experience added yet
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          paddingTop: 12,
          marginTop: 18,
          gap: 8,
          overflow: "hidden",
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
            }}
          >
            <span style={{ fontFamily: monoFont, fontSize: 9, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.06em",
              }}
            >
              btouch
            </div>
            <div
              style={{
                fontFamily: monoFont,
                fontSize: 7,
                color: "rgba(255,255,255,0.14)",
                letterSpacing: "0.1em",
                marginTop: 2,
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
            color: "rgba(255,255,255,0.13)",
            letterSpacing: "0.06em",
            flex: 1,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
            cursor: "pointer",
          }}
          onClick={copyUrl}
        >
          {copied ? "✓ copied" : `btouch.dev/${handle}`}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFlip?.();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(99,102,241,0.1)",
            border: "0.5px solid rgba(99,102,241,0.25)",
            borderRadius: 6,
            padding: "6px 12px",
            fontFamily: monoFont,
            fontSize: 9,
            color: "rgba(165,180,252,0.7)",
            letterSpacing: "0.08em",
            cursor: "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
            animation: "flipHintPulse 2.5s ease-in-out infinite",
          }}
        >
          <span style={{ display: "inline-block", animation: "spinHint 3s ease-in-out infinite" }}>↻</span>
          flip for stats
        </button>
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
  const trimmedData = trimLeadingZeroDays(active.data);
  const numWeeks = Math.max(1, Math.ceil(trimmedData.length / 7));
  const monthLabels = getMonthLabels(trimmedData);
  const totalContribs = trimmedData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = trimmedData.filter((day) => day.count > 0).length;
  const maxDay = trimmedData.reduce(
    (max, day) => (day.count > max.count ? day : max),
    { date: trimmedData[0]?.date ?? "", count: 0 },
  );
  const maxCount = Math.max(...trimmedData.map((day) => day.count), 0);
  const tabLabels = {
    all: "all",
    github: "gh",
    leetcode: "lc",
    codeforces: "cf",
    gfg: "gfg",
  } as const;
  const streakBest = Math.max(stats.longestStreak, stats.streak);

  if (trimmedData.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div
          style={{
            minHeight: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            background: "rgba(255,255,255,.025)",
            border: "0.5px solid rgba(255,255,255,.07)",
            color: "rgba(255,255,255,0.2)",
            fontFamily: monoFont,
            fontSize: 10,
            letterSpacing: "0.08em",
            textAlign: "center",
          }}
        >
          no stats available yet
        </div>
        <BtouchFooter side="back" handle={stats.handle} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.18em", color: "#1e3a50" }}>{"// coding stats"}</span>
        <span style={{ fontFamily: monoFont, fontSize: 8, color: "#1a5c38", letterSpacing: "0.06em" }}>@{stats.handle}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
        {stats.platformCards
          .filter((platform) => data.config.showPlatforms.includes(platform.platform))
          .map((platform) => (
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
              background:
                activePlatform === platform.platform
                  ? platform.platform === "codeforces"
                    ? "rgba(15,25,45,0.8)"
                    : `rgba(${platform.rgb}, 0.07)`
                  : "rgba(255,255,255,0.025)",
              border: activePlatform === platform.platform ? `0.5px solid rgba(${platform.rgb}, 0.18)` : "0.5px solid rgba(255,255,255,0.06)",
              borderLeft: activePlatform === platform.platform ? `2.5px solid ${platform.color}` : "0.5px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s",
              textAlign: "left",
            }}
          >
            <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.14em", color: platform.color, opacity: 0.8, marginBottom: 4 }}>
              {tabLabels[platform.platform]}
            </div>
            <div style={{ fontFamily: groteskFont, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: platform.color, lineHeight: 1, marginBottom: 4 }}>
              {platform.value}
            </div>
            <div style={{ fontFamily: monoFont, fontSize: 8, color: "rgba(255,255,255,.25)", letterSpacing: "0.06em" }}>{platform.label}</div>
            <MiniSparkline data={platform.data.slice(-8).map((day) => day.count)} color={platform.color} colorRgb={platform.rgb} />
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: monoFont, fontSize: 8, letterSpacing: "0.12em", color: "rgba(248,159,27,.45)", marginBottom: 3 }}>
              DAY STREAK
            </div>
            <div style={{ fontFamily: groteskFont, fontSize: 22, fontWeight: 700, color: "#f89f1b", lineHeight: 1, marginBottom: 2 }}>{stats.streak}</div>
            <div style={{ fontFamily: monoFont, fontSize: 6, color: "rgba(248,159,27,0.45)", letterSpacing: "0.08em" }}>days active</div>
          </div>
          <StreakRing streak={stats.streak} best={streakBest} />
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
        <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "nowrap", overflow: "hidden" }}>
          {(["all", ...data.config.showPlatforms] as const).map((platform) => (
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
                borderRadius: 5,
                border: "0.5px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activePlatform === platform ? `rgba(${stats.platformConfig[platform].rgb},0.12)` : "transparent",
                borderColor: activePlatform === platform ? `rgba(${stats.platformConfig[platform].rgb},0.35)` : "rgba(255,255,255,0.08)",
                color: activePlatform === platform ? stats.platformConfig[platform].color : "rgba(255,255,255,0.22)",
                borderLeft: activePlatform === platform ? `2px solid ${stats.platformConfig[platform].color}` : "0.5px solid rgba(255,255,255,0.08)",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {tabLabels[platform]}
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
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(7, 1fr)",
                gap: 2,
                paddingTop: 2,
                flexShrink: 0,
              }}
            >
              {["S", "M", "T", "W", "T", "F", "S"].map((dayLabel, index) => (
                <div
                  key={`${dayLabel}-${index}`}
                  style={{
                    fontFamily: monoFont,
                    fontSize: 7,
                    color: index % 2 === 1 ? "rgba(255,255,255,0.2)" : "transparent",
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    height: "calc(100% / 7)",
                  }}
                >
                  {dayLabel}
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${numWeeks}, 1fr)`,
                  gap: 2,
                  marginBottom: 4,
                  paddingLeft: 0,
                }}
              >
                {Array.from({ length: numWeeks }).map((_, weekIndex) => {
                  const month = monthLabels.find((entry) => entry.weekIndex === weekIndex);
                  return (
                    <div
                      key={weekIndex}
                      style={{
                        fontFamily: monoFont,
                        fontSize: 7,
                        color: month ? "rgba(255,255,255,0.2)" : "transparent",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      {month?.label ?? ""}
                    </div>
                  );
                })}
              </div>

              <div
                key={activePlatform}
                className="heatmap-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${numWeeks}, 1fr)`,
                  gridTemplateRows: "repeat(7, 1fr)",
                  gridAutoFlow: "column",
                  gap: 2,
                  width: "100%",
                  animation: "heatmapFade 0.3s ease-out",
                }}
              >
                {trimmedData.map((day, index) => {
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
                        borderRadius: 1,
                        background: `rgba(${active.rgb},${opacity.toFixed(2)})`,
                        cursor: day.count > 0 ? "pointer" : "default",
                        transition: "transform 0.1s, outline 0.1s",
                        transform: hoveredDot?.index === index ? "scale(1.25)" : "scale(1)",
                        outline: hoveredDot?.index === index ? `1px solid rgba(${active.rgb},0.6)` : "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {hoveredDot ? (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                left: `${Math.min(Math.max(Math.floor(hoveredDot.index / 7) * (100 / numWeeks), 8), 80)}%`,
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

      <BtouchFooter side="back" handle={stats.handle} rankPill={stats.rank || undefined} />
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

      {side === "back" && rankPill ? (
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
          {rankPill}
        </div>
      ) : null}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function trimLeadingZeroDays(data: HeatmapDay[]) {
  let start = 0;

  while (start < data.length - 1 && data[start].count === 0) {
    start += 1;
  }

  start = Math.max(0, start - (start % 7));
  return data.slice(start);
}

function getMonthLabels(data: HeatmapDay[]) {
  const labels: { label: string; weekIndex: number }[] = [];
  let lastMonth = "";

  data.forEach((day, index) => {
    const month = new Date(day.date).toLocaleString("default", { month: "short" });
    if (month !== lastMonth) {
      labels.push({ label: month, weekIndex: Math.floor(index / 7) });
      lastMonth = month;
    }
  });

  return labels;
}

function MiniSparkline({ data, color, colorRgb }: { data: number[]; color: string; colorRgb: string }) {
  const max = Math.max(...data, 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 14, marginTop: 6 }}>
      {data.slice(-8).map((value, index) => (
        <div
          key={`${colorRgb}-${index}`}
          style={{
            flex: 1,
            height: `${Math.max(2, (value / max) * 14)}px`,
            background: index === 7 ? color : `rgba(${colorRgb},0.3)`,
            borderRadius: 1,
            transition: "height 0.3s",
          }}
        />
      ))}
    </div>
  );
}

function StreakRing({ streak, best }: { streak: number; best: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(streak / Math.max(best, 1), 1);
  const dash = pct * circumference;

  return (
    <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
      <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(248,159,27,0.12)" strokeWidth="3" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke="#f89f1b"
          strokeWidth="3"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, fontWeight: 700, color: "#f89f1b", lineHeight: 1 }}>{streak}</div>
        <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 6, color: "rgba(248,159,27,0.45)", letterSpacing: "0.08em", marginTop: 1 }}>days</div>
      </div>
    </div>
  );
}

function normalizeHeatmap(source: number[] | undefined) {
  const heatmap = source && source.length > 0 ? source : [];

  return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const raw = heatmap[index % heatmap.length] ?? 0;
    return Math.max(0, Math.min(4, raw));
  });
}

function buildContributionSeries(levels: number[], scale: number, seedOffset: number): HeatmapDay[] {
  if (levels.length === 0) {
    return [];
  }

  return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (HEATMAP_DAYS - 1 - index));
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
  const combinedData = Array.from({ length: HEATMAP_DAYS }, (_, index) => ({
    date: githubData[index]?.date ?? "",
    count:
      (githubData[index]?.count ?? 0) +
      (leetcodeData[index]?.count ?? 0) +
      (codeforcesData[index]?.count ?? 0) +
      (gfgData[index]?.count ?? 0),
  }));

  return {
    handle: data.config.username,
    streak: leetcode?.streak ?? gfg?.streak ?? 0,
    longestStreak: Math.max(leetcode?.streak ?? 0, gfg?.streak ?? 0),
    rank:
      leetcode?.ranking !== null && leetcode?.ranking !== undefined
        ? `#${leetcode.ranking.toLocaleString()}`
        : codeforces?.rank ?? "",
    platformCards: [
      { key: "GITHUB", value: github?.followers != null ? github.followers.toLocaleString() : "", label: "followers", color: PLATFORM_META.github.color, platform: "github" as const, rgb: PLATFORM_META.github.rgb, data: githubData },
      { key: "LEETCODE", value: leetcode?.solved.total != null ? leetcode.solved.total.toLocaleString() : "", label: "problems solved", color: PLATFORM_META.leetcode.color, platform: "leetcode" as const, rgb: PLATFORM_META.leetcode.rgb, data: leetcodeData },
      { key: "CODEFORCES", value: codeforces?.rating != null ? codeforces.rating.toLocaleString() : "", label: "current rating", color: PLATFORM_META.codeforces.color, platform: "codeforces" as const, rgb: PLATFORM_META.codeforces.rgb, data: codeforcesData },
      { key: "GFG", value: gfg?.score != null ? gfg.score.toLocaleString() : "", label: "practice score", color: PLATFORM_META.gfg.color, platform: "gfg" as const, rgb: PLATFORM_META.gfg.rgb, data: gfgData },
    ],
    platformConfig: {
      all: { label: "ALL CONTRIBUTIONS", color: PLATFORM_META.github.color, rgb: PLATFORM_META.github.rgb, data: combinedData },
      github: { label: "GITHUB COMMITS", color: PLATFORM_META.github.color, rgb: PLATFORM_META.github.rgb, data: githubData },
      leetcode: { label: "LEETCODE SUBMISSIONS", color: PLATFORM_META.leetcode.color, rgb: PLATFORM_META.leetcode.rgb, data: leetcodeData },
      codeforces: { label: "CODEFORCES SUBMISSIONS", color: PLATFORM_META.codeforces.color, rgb: PLATFORM_META.codeforces.rgb, data: codeforcesData },
      gfg: { label: "GFG SUBMISSIONS", color: PLATFORM_META.gfg.color, rgb: PLATFORM_META.gfg.rgb, data: gfgData },
    } satisfies Record<PlatformKey, { label: string; color: string; rgb: string; data: HeatmapDay[] }>,
  };
}
