"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const circumference = 144.51;

export function ScoreRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(score / 1000, 1));
  const progress = useMotionValue(circumference);
  const dashOffset = useTransform(progress, (value) => value);

  useEffect(() => {
    const animation = animate(progress, circumference * (1 - normalized), {
      duration: 1.2,
      ease: "easeOut",
    });
    return () => animation.stop();
  }, [normalized, progress]);

  return (
    <svg width="58" height="58" viewBox="0 0 58 58">
      <g transform="rotate(-90 29 29)">
        <circle cx="29" cy="29" r="23" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <motion.circle
          cx="29"
          cy="29"
          r="23"
          fill="none"
          stroke="#888"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </g>
      <text x="29" y="33" textAnchor="middle" fill="rgba(216,210,200,0.45)" fontSize="11">
        {`${Math.round(score / 10)}%`}
      </text>
    </svg>
  );
}
