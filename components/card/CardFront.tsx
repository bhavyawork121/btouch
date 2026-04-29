"use client";

import { ArrowRight, Upload, UserRound } from "lucide-react";
import { getPublicUrl } from "@/lib/btouch";
import type { PlatformStats, UserConfig } from "@/types/stats";
import { useRef } from "react";

const languageColors = ["#444", "#888", "#aaa", "#ccc"];

function fallbackLanguages(stats: PlatformStats) {
  if (!stats.github?.languageBreakdown?.length) {
    return [
      { label: "TypeScript", percent: 68 },
      { label: "JavaScript", percent: 18 },
      { label: "Python", percent: 9 },
      { label: "Other", percent: 5 },
    ];
  }

  const list = stats.github.languageBreakdown.slice(0, 4);
  const total = list.reduce((sum, item) => sum + item.percent, 0);
  const normalized = list.map((item) => ({ ...item, percent: Math.round((item.percent / total) * 100) }));

  while (normalized.length < 4) {
    normalized.push({ label: normalized.length === 3 ? "Other" : "—", percent: normalized.length === 3 ? Math.max(0, 100 - normalized.reduce((sum, item) => sum + item.percent, 0)) : 0 });
  }

  return normalized.slice(0, 4);
}

function qrUrl(config: UserConfig) {
  return `/api/qr?url=${encodeURIComponent(config.portfolioUrl || getPublicUrl(config.username))}`;
}

export function CardFront({
  config,
  stats,
  onFlip,
  editable,
  onAvatarSelect,
}: {
  config: UserConfig;
  stats: PlatformStats;
  onFlip: () => void;
  editable?: boolean;
  onAvatarSelect?: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const languages = fallbackLanguages(stats);

  async function handleFile(event: { target: HTMLInputElement }) {
    const file = event.target.files?.[0];
    if (!file || !onAvatarSelect) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAvatarSelect(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="relative h-[499px] w-[300px] overflow-hidden rounded-[14px] border border-[var(--cream-border)] bg-[var(--cream-base)] text-[var(--cream-text)]">
      <div className="flex items-center justify-between bg-[#111] px-[14px] py-[10px]">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[rgba(216,210,200,0.24)]">btouch · developer id</p>
        <div className="rounded-[3px] border border-[#303030] bg-[#1e1e1e] px-2 py-[3px] text-[8px] text-[#666]">
          {config.linkedinVerified ? "VERIFIED" : "PROFILE"}
        </div>
      </div>
      <div className="h-[2px] bg-[var(--accent-line)]" />
      <div className="flex h-[calc(100%-44px)] flex-col px-[14px] py-[10px]">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => editable && inputRef.current?.click()}
            className="relative flex h-[80px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] border border-[var(--cream-border)] bg-[#e0dace]"
          >
            {config.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.avatarUrl} alt={config.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[#999]">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#ccc6bc]">
                  <UserRound className="h-5 w-5 text-[#7b7468]" />
                </span>
                <span className="text-[7.5px]">{editable ? "Tap to upload" : "No photo"}</span>
              </div>
            )}
            {editable ? (
              <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#111] text-[var(--cream-base)]">
                <Upload className="h-3 w-3" />
              </span>
            ) : null}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] text-[#777]">Developer Identity</p>
            <div className="mt-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate font-serif text-[16px] font-bold leading-[1.15] text-[#0d0d0d]">{config.name}</h2>
                <p className="mt-0.5 line-clamp-2 text-[8.5px] uppercase tracking-[0.04em] leading-[1.35] text-[#555]">{config.tagline || "Product Engineer · btouch"}</p>
              </div>
              <div className="grid h-[22px] w-[30px] grid-cols-2 grid-rows-3 gap-[1px] rounded-[3px] border border-[#444] bg-[#555] p-[2px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index} className="rounded-[1px] bg-[rgba(255,255,255,0.12)]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
          <div className="h-[5px] w-[5px] rounded-full bg-[#888]" />
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
        </div>

        <div>
          <p className="text-[8px] uppercase tracking-[0.14em] text-[#888]">Career</p>
          <div className="relative mt-2 space-y-2.5 pl-4">
            <div className="absolute bottom-2 left-[3px] top-2 w-px bg-[var(--cream-border)]" />
            {(config.experience.length ? config.experience : [{ role: "Add experience", company: "Independent", period: "2024–Present", initial: "•" }]).slice(0, 3).map((entry, index) => (
              <div key={`${entry.role}-${entry.company}-${index}`} className="relative">
                <span className={`absolute -left-[14px] top-[5px] h-[7px] w-[7px] rounded-full ${index === 0 ? "bg-[#111]" : "border-[1.5px] border-[#aaa] bg-[var(--cream-base)]"}`} />
                <p className="text-[8px] text-[#999]">{entry.period || "—"}</p>
                <p className="text-[11px] font-semibold text-[#111]">{entry.role || "—"}</p>
                <p className="text-[9.5px] leading-[1.25] text-[#666]">{entry.company || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
          <div className="h-[5px] w-[5px] rounded-full bg-[#888]" />
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
        </div>

        <div>
          <p className="text-[8px] uppercase tracking-[0.14em] text-[#888]">Languages</p>
          <div className="mt-2 space-y-[6px]">
            {languages.map((item, index) => (
              <div key={item.label} className="grid grid-cols-[52px_1fr_22px] items-center gap-2">
                <span className="truncate text-[9px] text-[#444]">{item.label}</span>
                <div className="h-[3.5px] rounded-full bg-[var(--cream-border)]">
                  <div className="h-[3.5px] rounded-full" style={{ width: `${item.percent}%`, background: languageColors[index] || "#444" }} />
                </div>
                <span className="text-right text-[9px] text-[#666]">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[8px] uppercase tracking-[0.14em] text-[#888]">Skills</p>
            <div className="mt-1.5 flex max-h-[54px] flex-wrap gap-1 overflow-hidden">
              {(config.skills.length ? config.skills : ["React", "Node.js", "TypeScript", "PostgreSQL"]).slice(0, 8).map((skill) => (
                <span key={skill} className="rounded-[4px] border border-[#beb6a8] bg-[rgba(0,0,0,0.05)] px-[7px] py-[2px] text-[9px] text-[#444]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-center">
            <div className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-[4px] border border-[#c8c0b4] bg-[#e3ddd3]">
              <img src={qrUrl(config)} alt="Portfolio QR code" className="h-[44px] w-[44px]" />
            </div>
            <p className="mt-1 text-[7.5px] text-[#999]">Portfolio</p>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={onFlip}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#2e2e2e] bg-[#111] px-[12px] py-[5px] text-[10px] text-[rgba(216,210,200,0.5)]"
          >
            Stats
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}
