"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LivePreviewCard } from "@/components/card/LivePreviewCard";
import { dashboardCopy } from "@/lib/copy";
import { accentOptions, resolveAccent } from "@/lib/theme";
import type { CardData } from "@/types/card";
import type { SaveCardConfigResult } from "@/app/dashboard/actions";
import { saveCardConfig } from "@/app/dashboard/actions";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-platform-linkedin";

interface DashboardEditorProps {
  preview: {
    username: string;
    linkedinHandle: string | null;
    handles: {
      github: string | null;
      leetcode: string | null;
      codeforces: string | null;
      gfg: string | null;
    };
    theme: string;
    accentColor: string;
    data: CardData;
  };
}

interface Notice {
  kind: "success" | "error";
  message: string;
}

export function DashboardEditor({ preview }: DashboardEditorProps) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [isRefreshing, startRefreshing] = useTransition();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [toast, setToast] = useState<Notice | null>(null);
  const [previewState, setPreviewState] = useState(preview);

  function applyResult(result: SaveCardConfigResult) {
    setNotice({
      kind: result.ok ? "success" : "error",
      message: result.message,
    });
    setToast({
      kind: result.ok ? "success" : "error",
      message: result.message,
    });
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <main
      className="page-enter mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[240px_minmax(0,1fr)_380px]"
      style={{
        backgroundColor: "#060810",
        backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 50%)",
      }}
    >
      <aside
        className="hidden rounded-[24px] border border-white/6 bg-black/10 p-4 backdrop-blur-xl lg:flex lg:flex-col"
        style={{ borderRight: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "0 8px" }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, fontWeight: 700, color: "#fff" }}>b</span>
          </div>
          <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
            btouch
          </span>
        </div>

        {[
          { icon: "▤", label: "My card", href: "/dashboard" },
          { icon: "○", label: "Preview", href: previewState.username ? `/${previewState.username}` : "/dashboard" },
          { icon: "⟳", label: "Refresh", href: "/api/refresh" },
          { icon: "⚙", label: "Settings", href: "/dashboard" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-lg px-3 py-2 transition hover:bg-white/5"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.35)",
              background: "transparent",
            }}
          >
            <span style={{ fontSize: 12 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </aside>

      <section className="w-full rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Dashboard</p>
            <h1 className="font-display text-3xl font-semibold text-white">Edit your public card</h1>
          </div>
          <Link
            href={previewState.username ? `/${previewState.username}` : "/"}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            View public page
          </Link>
        </div>

        <form
          id="dashboard-form"
          action={(formData) => {
            startSaving(async () => {
              const result = await saveCardConfig(formData);
              applyResult(result);
              if (result.ok) {
                router.refresh();
              }
            });
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm text-slate-300">Public username</span>
            <input
              className={inputClassName}
              name="username"
              value={previewState.username}
              onChange={(event) => setPreviewState((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2 md:col-span-1">
            <span className="text-sm text-slate-300">Display name</span>
            <input
              className={inputClassName}
              name="displayName"
              value={previewState.data.profile.displayName ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, displayName: event.target.value },
                  },
                }))
              }
              required
            />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-slate-300">Headline</span>
            <input
              className={inputClassName}
              name="headline"
              value={previewState.data.profile.headline ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, headline: event.target.value },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-slate-300">Bio</span>
            <textarea
              className={`${inputClassName} min-h-28 resize-none`}
              name="bio"
              value={previewState.data.profile.bio ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, bio: event.target.value },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Avatar URL</span>
            <input
              className={inputClassName}
              name="avatarUrl"
              value={previewState.data.profile.avatarUrl ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, avatarUrl: event.target.value || null },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">LinkedIn handle</span>
            <input
              className={inputClassName}
              name="linkedinHandle"
              value={previewState.linkedinHandle ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  linkedinHandle: event.target.value,
                  data: {
                    ...current.data,
                    profile: {
                      ...current.data.profile,
                      linkedinUrl: event.target.value
                        ? `https://www.linkedin.com/in/${event.target.value}`
                        : null,
                    },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Current role</span>
            <input
              className={inputClassName}
              name="currentRole"
              value={previewState.data.profile.currentRole ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, currentRole: event.target.value || null },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Current company</span>
            <input
              className={inputClassName}
              name="currentCompany"
              value={previewState.data.profile.currentCompany ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  data: {
                    ...current.data,
                    profile: { ...current.data.profile, currentCompany: event.target.value || null },
                  },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">GitHub handle</span>
            <input
              className={inputClassName}
              name="githubHandle"
              value={previewState.handles.github ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  handles: { ...current.handles, github: event.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">LeetCode handle</span>
            <input
              className={inputClassName}
              name="leetcodeHandle"
              value={previewState.handles.leetcode ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  handles: { ...current.handles, leetcode: event.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Codeforces handle</span>
            <input
              className={inputClassName}
              name="cfHandle"
              value={previewState.handles.codeforces ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  handles: { ...current.handles, codeforces: event.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">GFG handle</span>
            <input
              className={inputClassName}
              name="gfgHandle"
              value={previewState.handles.gfg ?? ""}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  handles: { ...current.handles, gfg: event.target.value },
                }))
              }
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Theme</span>
            <select
              className={inputClassName}
              name="theme"
              value={previewState.theme}
              onChange={(event) =>
                setPreviewState((current) => ({
                  ...current,
                  theme: event.target.value,
                  data: {
                    ...current.data,
                    appearance: {
                      ...current.data.appearance,
                      theme: event.target.value as CardData["appearance"]["theme"],
                    },
                  },
                }))
              }
            >
              <option value="dark">dark</option>
              <option value="light">light</option>
              <option value="auto">auto</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Accent color</span>
            <input
              type="hidden"
              name="accentColor"
              value={previewState.accentColor}
            />
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {accentOptions.map((accent) => {
                const isSelected = previewState.accentColor === accent;
                const swatch = resolveAccent(accent);

                return (
                  <button
                    key={accent}
                    type="button"
                    onClick={() =>
                      setPreviewState((current) => ({
                        ...current,
                        accentColor: accent,
                        data: {
                          ...current.data,
                          appearance: { ...current.data.appearance, accentColor: accent },
                        },
                      }))
                    }
                    className={`rounded-2xl border px-3 py-3 text-left transition ${
                      isSelected ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="mb-2 block h-4 w-4 rounded-full" style={{ background: swatch.hex }} />
                    <span className="block text-xs capitalize text-slate-200">{accent}</span>
                  </button>
                );
              })}
            </div>
          </label>

          <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-6 text-sm">
              {notice ? (
                <p className={notice.kind === "success" ? "text-emerald-300" : "text-rose-300"}>{notice.message}</p>
              ) : (
                <p className="text-slate-500">{dashboardCopy.platformHint}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  startRefreshing(async () => {
                    setNotice(null);
                    const response = await fetch("/api/refresh", { method: "POST" });

                    if (!response.ok) {
                      const message = "Cache refresh failed.";
                      setNotice({ kind: "error", message });
                      setToast({ kind: "error", message });
                      window.setTimeout(() => setToast(null), 2500);
                      return;
                    }

                    const message = "Live stats refreshed.";
                    setNotice({ kind: "success", message });
                    setToast({ kind: "success", message });
                    window.setTimeout(() => setToast(null), 2500);
                    router.refresh();
                  });
                }}
                disabled={isSaving || isRefreshing}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRefreshing ? "Refreshing..." : "Refresh stats"}
              </button>
              <button
                disabled={isSaving || isRefreshing}
                className="rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save card"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <aside className="flex flex-col items-center gap-4 lg:sticky lg:top-10 lg:self-start">
        <div className="w-full rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-3 text-center font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/20">live preview</div>
          <LivePreviewCard previewData={previewState.data} />
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              form="dashboard-form"
              className="flex-[2] rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-white/70 transition hover:bg-white/10"
            >
              save changes
            </button>
            <Link
              href={previewState.username ? `/${previewState.username}` : "/dashboard"}
              target="_blank"
              className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-center font-mono text-[10px] tracking-[0.1em] text-white/40 transition hover:bg-white/10"
              style={{ textDecoration: "none" }}
            >
              view live ↗
            </Link>
          </div>
        </div>
      </aside>

      {toast ? (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.kind === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `0.5px solid ${toast.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 10,
            color: toast.kind === "success" ? "rgba(134,239,172,0.9)" : "rgba(252,165,165,0.9)",
            letterSpacing: "0.06em",
            zIndex: 100,
            whiteSpace: "nowrap",
            animation: "toastIn 0.2s ease-out",
          }}
        >
          {toast.kind === "success" ? "✓ " : "✗ "}
          {toast.message}
        </div>
      ) : null}
    </main>
  );
}
