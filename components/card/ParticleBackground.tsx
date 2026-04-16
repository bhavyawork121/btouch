"use client";

import { useMemo, type CSSProperties } from "react";

interface ParticleBackgroundProps {
  enabled: boolean;
  className?: string;
}

interface Particle {
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
  drift: string;
}

function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function ParticleBackground({ enabled, className }: ParticleBackgroundProps) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const seed = index + 1;
        const left = `${Math.round(seededValue(seed) * 100)}%`;
        const size = `${4 + Math.round(seededValue(seed * 2) * 8)}px`;
        const duration = `${10 + Math.round(seededValue(seed * 3) * 10)}s`;
        const delay = `-${Math.round(seededValue(seed * 4) * 8)}s`;
        const opacity = (0.1 + seededValue(seed * 5) * 0.25).toFixed(2);
        const drift = `${Math.round((seededValue(seed * 6) - 0.5) * 80)}px`;

        return {
          left,
          size,
          duration,
          delay,
          opacity,
          drift,
        };
      }),
    [],
  );

  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden="true" className={["pointer-events-none absolute inset-0 overflow-hidden", className ?? ""].join(" ")}>
      {particles.map((particle, index) => (
        <span
          key={`${particle.left}-${index}`}
          className="btouch-particle absolute bottom-[-10%] rounded-full bg-white"
          style={
            {
              left: particle.left,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              ["--btouch-duration" as never]: particle.duration,
              ["--btouch-delay" as never]: particle.delay,
              ["--btouch-drift" as never]: particle.drift,
              ["--btouch-opacity" as never]: particle.opacity,
            } as CSSProperties
          }
        />
      ))}
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .btouch-particle {
            animation: btouch-particle-float var(--btouch-duration) linear infinite;
            animation-delay: var(--btouch-delay);
          }
        }

        @keyframes btouch-particle-float {
          0% {
            transform: translate3d(0, 24px, 0) scale(0.88);
            opacity: 0;
          }
          18% {
            opacity: var(--btouch-opacity);
          }
          100% {
            transform: translate3d(var(--btouch-drift), -140px, 0) scale(1.08);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
