"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { CardBack } from "@/components/card/CardBack";
import { CardFront } from "@/components/card/CardFront";
import { FlipButton } from "@/components/ui/FlipButton";
import type { CardData } from "@/types/card";

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("a, button, input, textarea, select, [role='button'], [data-prevent-card-flip='true']"))
    : false;
}

interface FlipCardProps {
  data: CardData;
  username?: string;
  initialViewMode?: "compact" | "full";
  onFlipChange?: (isFlipped: boolean) => void;
  onShare?: () => void;
  onRefresh?: () => void;
  emptyStateHref?: string;
  isOwner?: boolean;
  className?: string;
}

export function FlipCard({
  data,
  username,
  initialViewMode: _initialViewMode = "compact",
  onFlipChange,
  onShare,
  onRefresh,
  emptyStateHref = "/dashboard",
  isOwner = false,
  className,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    onFlipChange?.(isFlipped);
  }, [isFlipped, onFlipChange]);

  function toggleFlip() {
    setIsFlipped((current) => !current);
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    toggleFlip();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFlip();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];
    const start = touchStartRef.current;

    if (!touch || !start || isInteractiveTarget(event.target)) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const elapsed = Date.now() - start.time;

    if (deltaX < -60 && Math.abs(deltaY) < 40) {
      toggleFlip();
      touchStartRef.current = null;
      return;
    }

    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20 && elapsed < 400) {
      if (Date.now() - lastTapRef.current < 300) {
        toggleFlip();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = Date.now();
      }
    }

    touchStartRef.current = null;
  }

  const faceTransition = prefersReducedMotion
    ? { duration: 0.3, ease: "easeOut" as const }
    : { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={["w-full", className ?? ""].join(" ")}
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Developer card. Press F to flip."
        className="relative w-full outline-none"
        style={{ perspective: 1200, minHeight: "640px" }}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transition: prefersReducedMotion
              ? `opacity ${faceTransition.duration}s ${faceTransition.ease}`
              : `transform ${faceTransition.duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
            transform: prefersReducedMotion ? "none" : `rotateY(${isFlipped ? 180 : 0}deg)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: isFlipped && prefersReducedMotion ? "none" : "auto",
              opacity: prefersReducedMotion ? (isFlipped ? 0 : 1) : 1,
              transform: prefersReducedMotion ? "none" : "rotateY(0deg)",
              transition: prefersReducedMotion ? `opacity ${faceTransition.duration}s ${faceTransition.ease}` : undefined,
            }}
          >
            <CardFront
              data={data}
              username={username}
              displayName={data.profile.displayName ?? username ?? data.config.username}
              tagline={data.profile.headline}
              bio={data.profile.bio}
              avatarUrl={data.profile.avatarUrl}
              linkedinUrl={data.profile.linkedinUrl}
              workExperience={data.profile.experience?.map((experience) => ({
                company: experience.company,
                role: experience.role,
                startDate: null,
                endDate: experience.duration,
                description: experience.description,
              }))}
              isOwner={isOwner}
              onShare={onShare}
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: !isFlipped && prefersReducedMotion ? "none" : "auto",
              opacity: prefersReducedMotion ? (isFlipped ? 1 : 0) : 1,
              transform: prefersReducedMotion ? "none" : "rotateY(180deg)",
              transition: prefersReducedMotion ? `opacity ${faceTransition.duration}s ${faceTransition.ease}` : undefined,
            }}
          >
            <CardBack
              data={data}
              isActive={isFlipped}
              onRefresh={onRefresh}
              emptyStateHref={emptyStateHref}
            />
          </div>
        </div>

        <FlipButton
          isFlipped={isFlipped}
          onClick={toggleFlip}
          className="absolute bottom-3 right-3 z-20"
        />

        <span className="sr-only" aria-live="polite">
          {isFlipped ? "Back face showing" : "Front face showing"}
        </span>
      </div>
    </motion.div>
  );
}
