"use client";

import { useEffect, useMemo, useState } from "react";

interface CountUpProps {
  value: number | string;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  trigger?: boolean;
  decimals?: number;
}

function formatNumber(value: number, decimals: number) {
  if (decimals > 0) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
}

export function CountUp({
  value,
  durationMs = 1000,
  delayMs = 0,
  className,
  prefix = "",
  suffix = "",
  trigger = true,
  decimals = 0,
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState<string>(() =>
    typeof value === "number" ? formatNumber(value, decimals) : value,
  );

  const numericValue = useMemo(() => (typeof value === "number" && Number.isFinite(value) ? value : null), [value]);

  useEffect(() => {
    if (!trigger || numericValue === null) {
      setDisplayValue(typeof value === "number" ? formatNumber(value, decimals) : value);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(formatNumber(numericValue, decimals));
      return;
    }

    let startTime = 0;
    let timeoutId = 0;
    let animationFrame = 0;

    const run = () => {
      startTime = performance.now();

      const step = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = numericValue * eased;
        setDisplayValue(formatNumber(currentValue, decimals));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        }
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    timeoutId = window.setTimeout(run, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [decimals, delayMs, durationMs, numericValue, trigger, value]);

  return <span className={className}>{prefix}{displayValue}{suffix}</span>;
}
