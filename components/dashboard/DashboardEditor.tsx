"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FlipCard } from "@/components/card/FlipCard";
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
  const [previewState, setPreviewState] = useState(preview);

  function applyResult(result: SaveCardConfigResult) {
    setNotice({
      kind: result.ok ? "success" : "error",
      message: result.message,
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-start">
      <section className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
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
              value={previewState.data.profile.displayName}
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
              value={previewState.data.profile.headline}
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
              value={previewState.data.profile.bio}
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
                <p className="text-slate-500">Changes save to your public card and refresh cache.</p>
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
                      setNotice({ kind: "error", message: "Cache refresh failed." });
                      return;
                    }

                    setNotice({ kind: "success", message: "Live stats refreshed." });
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

      <aside className="flex flex-1 justify-center lg:sticky lg:top-10">
        <FlipCard data={previewState.data} username={previewState.username || "preview"} />
      </aside>
    </main>
  );
}
