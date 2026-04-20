"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { CardData } from "@/types/card";
import { getAccentByName } from "@/lib/constants/accentColors";

interface LivePreviewProps {
  previewData: CardData;
  publicUrl: string;
  onSave: () => Promise<unknown>;
  onRefresh: () => Promise<unknown>;
  isSaving: boolean;
  isRefreshing: boolean;
  hasChanges: boolean;
}

function getInitials(name: string, fallback: string) {
  const source = name.trim() || fallback.trim() || "Btouch";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isValidUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function MagneticButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
      whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
}

export function LivePreview({
  previewData,
  publicUrl,
  onSave,
  onRefresh,
  isSaving,
  isRefreshing,
  hasChanges,
}: LivePreviewProps) {
  const reduceMotion = useReducedMotion();
  const accent = getAccentByName(previewData.appearance.accentColor);
  const profile = previewData.profile;
  const name = profile.displayName?.trim() || previewData.config.username || "btouch";
  const initials = useMemo(() => getInitials(name, previewData.config.username), [name, previewData.config.username]);
  const avatarValid = isValidUrl(profile.avatarUrl);
  const sections = [
    { label: "username", value: previewData.config.username || "preview" },
    { label: "headline", value: profile.headline || "Add a headline to make the card feel alive." },
    {
      label: "experience",
      value: [profile.currentRole, profile.currentCompany].filter(Boolean).join(" at ") || "Current role and company show here.",
    },
  ];

  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, x: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden h-screen w-[380px] flex-col border-l border-white/8 bg-[#0a0a0f]/80 px-5 py-5 backdrop-blur-xl xl:flex"
      style={{
        boxShadow: "inset 1px 0 0 rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">live preview</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
          {hasChanges ? "unsaved draft" : "synced"}
        </span>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-1 flex-col rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_70px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.65)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">online</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/22">updated live</span>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-white/10 p-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at top, rgb(var(--accent-rgb) / 0.18), transparent 40%), linear-gradient(180deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.03))",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <motion.div
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
                  }
            }
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <motion.div variants={reduceMotion ? undefined : { hidden: { opacity: 0 }, show: { opacity: 1 } }} className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/10 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10">
                  {avatarValid ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl ?? ""} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xl font-semibold text-white"
                      style={{
                        backgroundImage: "linear-gradient(135deg, rgb(var(--accent-rgb) / 0.95), rgb(255 255 255 / 0.08))",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">public card</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{profile.headline || "Your headline will appear here."}</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  <span className="text-[color:var(--accent)]">in</span>
                  <span className="font-mono">{profile.linkedinUrl?.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "") || "linkedin handle"}</span>
                </div>
              </div>
            </motion.div>

            <div className="h-px w-full bg-white/10" />

            <motion.div variants={reduceMotion ? undefined : { hidden: { opacity: 0 }, show: { opacity: 1 } }} className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/28">profile notes</p>
              <p className="text-sm leading-7 text-white/58">
                {profile.bio || "Add a bio to describe what you build, study, or ship. The preview updates as you type."}
              </p>
            </motion.div>

            <div className="grid gap-3">
              {sections.map((section, index) => (
                <motion.div
                  key={section.label}
                  variants={reduceMotion ? undefined : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.25, delay: index * 0.06 }}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">{section.label}</p>
                  <p className="mt-2 text-sm text-white/78">{section.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-4 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/55">
            <span>Accent color</span>
            <span className="font-mono uppercase tracking-[0.18em]" style={{ color: accent.hex }}>
              {accent.name}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <MagneticButton href={publicUrl}>
              <ExternalLink className="h-4 w-4" />
              View Live
            </MagneticButton>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--accent)]/35 bg-[color:var(--accent)] px-4 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Sparkles className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <motion.span animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.7, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}>
                <Sparkles className="h-4 w-4" />
              </motion.span>
              {isRefreshing ? "Refreshing..." : "Refresh Stats"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
