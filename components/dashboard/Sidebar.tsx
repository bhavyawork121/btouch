"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CreditCard, Eye, ExternalLink, RefreshCw, Settings2 } from "lucide-react";

interface SidebarProps {
  activeItem: "my-card" | "preview" | "refresh" | "settings";
  displayName: string;
  avatarUrl: string | null;
  username: string;
  publicUrl: string;
  onNavigate: (item: SidebarProps["activeItem"]) => void;
}

const items = [
  { key: "my-card", label: "My Card", icon: CreditCard },
  { key: "preview", label: "Preview", icon: Eye },
  { key: "refresh", label: "Refresh", icon: RefreshCw },
  { key: "settings", label: "Settings", icon: Settings2 },
] as const;

function initials(value: string) {
  return (value.trim() || "btouch")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar({ activeItem, displayName, avatarUrl, username, publicUrl, onNavigate }: SidebarProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, x: -20 }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden h-screen w-[240px] flex-col border-r border-white/8 bg-[#0a0a0f]/80 px-4 py-4 backdrop-blur-xl xl:flex"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.15), transparent 28%), radial-gradient(circle at 80% 80%, rgba(14,165,233,0.08), transparent 24%)",
      }}
    >
      <div className="sidebar-shell relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03]">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "8px 8px", maskImage: "linear-gradient(to bottom, black, transparent 92%)" }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%, rgba(255,255,255,0.01))",
          }}
        />

        <div className="relative z-10 flex items-center gap-3 border-b border-white/8 px-4 py-4">
          <motion.div
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            className="group flex h-10 w-10 items-center justify-center rounded-2xl transition"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--accent), rgba(255,255,255,0.12))",
              boxShadow: "0 0 25px color-mix(in srgb, var(--accent) 22%, transparent)",
            }}
          >
            <span className="font-mono text-base font-semibold text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.22)]">b</span>
          </motion.div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">btouch</p>
            <p className="mt-1 text-sm text-white/65">Edit your public card</p>
          </div>
        </div>

        <nav className="relative z-10 flex flex-1 flex-col gap-2 px-3 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeItem;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className="relative flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/65 transition hover:bg-white/[0.04] hover:text-white"
              >
                {isActive ? (
                  <motion.span layoutId="sidebar-active" className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-[color:var(--accent)]" />
                ) : null}
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isActive ? "border-[color:var(--accent)]/30 bg-[color:var(--accent)]/12 text-white" : "border-white/10 bg-white/[0.03] text-white/45"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-10 border-t border-white/8 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
                  style={{
                    backgroundImage: "linear-gradient(135deg, rgb(var(--accent-rgb) / 0.9), rgb(255 255 255 / 0.08))",
                  }}
                >
                  {initials(displayName)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{displayName || username}</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">/{username || "preview"}</p>
            </div>
          </div>

          <Link
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            View Public Page
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sidebar-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent 35%),
            radial-gradient(circle at top, rgba(255, 255, 255, 0.05), transparent 32%);
          opacity: 0.7;
        }
      `}</style>
    </motion.aside>
  );
}
