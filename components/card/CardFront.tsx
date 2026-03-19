"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { CardData } from "@/types/card";

const parent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 24,
    },
  },
};

const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

const dividerVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.3 } },
};

export function CardFront({
  data,
  onScrollIndexChange,
}: {
  data: CardData;
  onScrollIndexChange?: (index: number) => void;
}) {
  const linkedinUrl = data.profile.linkedinUrl;
  const headline = data.profile.headline || "Developer";
  const role = data.profile.currentRole ?? "Open to work";
  const company = data.profile.currentCompany ?? "Independent";
  const linkedInHandle = (linkedinUrl ?? "linkedin").replace("https://www.linkedin.com/in/", "");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    let hintHidden = false;
    const handleScroll = () => {
      if (!hintHidden) {
        const hint = document.getElementById("front-scroll-hint");
        if (hint) {
          hint.style.opacity = "0";
        }
        hintHidden = true;
      }

      if (!scrollElement) {
        return;
      }

      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
      const ratio = maxScroll > 0 ? scrollElement.scrollTop / maxScroll : 0;
      const nextIndex = Math.min(2, Math.floor(ratio * 3));
      onScrollIndexChange?.(nextIndex);
    };

    onScrollIndexChange?.(0);
    scrollElement?.addEventListener("scroll", handleScroll);
    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, [onScrollIndexChange]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={parent}
      className="flex h-full w-full flex-col rounded-[18px] border"
      style={{
        borderColor: "var(--card-border)",
        background: "#0d1117",
        padding: "12px 14px 10px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        ref={scrollRef}
        data-scroll-face="front"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          boxSizing: "border-box",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex min-w-0 items-start gap-[10px]" style={{ marginBottom: 6 }}>
          <motion.div variants={avatarVariants} className="shrink-0">
            <Avatar src={data.profile.avatarUrl} alt={data.profile.displayName} size={40} />
          </motion.div>
          <div className="min-w-0 flex-1">
            <motion.div variants={item}>
              <h2 className="font-display text-[14px] font-bold leading-[1.2]" style={{ color: "#f0f4ff" }}>
                {data.profile.displayName}
              </h2>
            </motion.div>
            <motion.p
              variants={item}
              className="truncate text-[10px]"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "#3d5570",
                letterSpacing: "0.04em",
                lineHeight: 1.4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: 3,
                maxWidth: "100%",
              }}
            >
              {headline}
            </motion.p>
            <motion.div
              variants={item}
              className="inline-flex items-center gap-[5px] border text-[9px]"
              style={{
                alignItems: "center",
                background: "rgba(10,102,194,0.08)",
                borderColor: "rgba(10,102,194,0.22)",
                borderRadius: 20,
                padding: "3px 10px",
                marginTop: 5,
                fontFamily: "var(--font-space-mono)",
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
            </motion.div>
          </div>
          <motion.button
            variants={item}
            type="button"
            className="rounded-full border px-[10px] py-1 text-[10px]"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              fontFamily: "var(--font-space-mono)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            live profile
          </motion.button>
        </div>

        <motion.div
          variants={dividerVariants}
          className="origin-left"
          style={{ height: "0.5px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }}
        />

        <motion.div
          variants={item}
          className="text-[10px]"
          style={{
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.5,
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data.profile.bio}
        </motion.div>

        <div
          className="text-[8.5px] uppercase"
          style={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-space-mono)",
            letterSpacing: "0.14em",
            marginBottom: 4,
          }}
        >
          Experience
        </div>
        <motion.div
          variants={item}
          className="flex items-center gap-[8px] rounded-[10px] px-[10px] py-[6px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            marginBottom: 8,
          }}
        >
          <BriefcaseBusiness className="h-[14px] w-[14px] shrink-0" style={{ color: "var(--card-accent)" }} />
          <span className="min-w-0 flex-1 text-[10px] font-medium" style={{ color: "#c8d8f0" }}>
            {role}
          </span>
          <span className="text-[10px] font-medium" style={{ color: "#f89f1b", flexShrink: 0, fontFamily: "var(--font-space-mono)" }}>
            {company}
          </span>
        </motion.div>

        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.05)", margin: "10px 0 8px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
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
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.06em",
                  lineHeight: 1,
                }}
              >
                btouch
              </div>
              <div
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: 7,
                  color: "rgba(255,255,255,0.18)",
                  letterSpacing: "0.1em",
                  marginTop: 1,
                }}
              >
                dev identity card
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(99,102,241,0.08)",
              border: "0.5px solid rgba(99,102,241,0.2)",
              borderRadius: 20,
              padding: "5px 12px",
              fontFamily: "var(--font-space-mono)",
              fontSize: 9,
              color: "rgba(165,180,252,0.6)",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            <span>↻</span>
            tap to flip
          </div>
        </div>
      </div>
      <style jsx global>{`
        [data-scroll-face="front"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}
