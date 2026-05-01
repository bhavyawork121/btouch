"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getPublicUrl } from "@/lib/btouch";
import type { UserConfig, WorkEntry } from "@/types/stats";
import { useUiTheme } from "@/components/theme/UiThemeProvider";
import { FunZonePicker } from "./FunZonePicker";
import { LivePreview } from "./LivePreview";

function sectionTitle(title: string, subtitle: string) {
  return (
    <div className="mb-4">
      <p className="theme-text-soft text-[11px] uppercase tracking-[0.22em]">{title}</p>
      <p className="theme-text-muted mt-1 text-sm">{subtitle}</p>
    </div>
  );
}

function inputClass() {
  return "theme-input rounded-[14px] px-4 py-3 text-sm outline-none";
}

export function Editor({ initialConfig }: { initialConfig: UserConfig }) {
  const [config, setConfig] = useState<UserConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const { uiTheme, toggleUiTheme } = useUiTheme();
  const publicUrl = useMemo(() => getPublicUrl(config.username), [config.username]);

  function updateExperience(index: number, patch: Partial<WorkEntry>) {
    setConfig((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/dashboard/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: config.username,
          name: config.name,
          initials: config.initials,
          tagline: config.tagline,
          bio: config.bio,
          avatarUrl: config.avatarUrl,
          linkedinUrl: config.linkedinUrl,
          linkedinVerified: config.linkedinVerified,
          portfolioUrl: config.portfolioUrl,
          github: config.handles.github,
          leetcode: config.handles.leetcode,
          codeforces: config.handles.codeforces,
          gfg: config.handles.gfg,
          skills: config.skills.slice(0, 8),
          experience: config.experience,
          funZoneType: config.funZone.type,
          funZoneValue: config.funZone.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const payload = (await response.json()) as { username: string };
      setConfig((current) => ({ ...current, username: payload.username }));
      setMessage("Saved.");
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      data-ui-theme={uiTheme}
      className="theme-shell theme-content mx-auto grid min-h-screen max-w-[1420px] gap-8 px-6 py-8 xl:grid-cols-[minmax(0,1fr)_420px]"
    >
      <section className="space-y-6">
        <div className="theme-panel rounded-[24px] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="theme-text-soft text-[11px] uppercase tracking-[0.28em]">Dashboard</p>
              <h1 className="theme-text mt-2 font-serif text-4xl">Developer identity editor</h1>
            </div>
            <button
              type="button"
              onClick={toggleUiTheme}
              className="theme-button-secondary inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm"
              aria-label={`Switch to ${uiTheme === "dark" ? "light" : "dark"} theme`}
            >
              <SunMedium className={`h-4 w-4 ${uiTheme === "light" ? "text-amber-500" : "theme-text-soft"}`} />
              <span>{uiTheme === "light" ? "Light" : "Dark"} theme</span>
              <MoonStar className={`h-4 w-4 ${uiTheme === "dark" ? "text-cyan-300" : "theme-text-soft"}`} />
            </button>
          </div>
          <div className="theme-subpanel mt-6 rounded-[18px] p-4">
            <p className="theme-text-soft text-[11px] uppercase tracking-[0.18em]">Shareable link</p>
            <div className="mt-3 flex gap-3">
              <input readOnly value={`btouch.dev/@${config.username}`} className={`${inputClass()} font-mono`} />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(publicUrl)}
                className="theme-button-secondary inline-flex items-center gap-2 rounded-[14px] px-4 text-sm"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <p className="theme-text-muted mt-2 text-sm">This is your public card URL — anyone can view it</p>
          </div>
        </div>

        <div className="theme-panel grid gap-6 rounded-[24px] p-6 md:grid-cols-2">
          <div className="md:col-span-2">{sectionTitle("Identity", "Public-facing identity details shown on the card.")}</div>
          <input value={config.username} onChange={(event) => setConfig({ ...config, username: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} className={inputClass()} placeholder="username" />
          <input value={config.name} onChange={(event) => setConfig({ ...config, name: event.target.value })} className={inputClass()} placeholder="name" />
          <input value={config.initials} onChange={(event) => setConfig({ ...config, initials: event.target.value.toUpperCase() })} className={inputClass()} placeholder="initials" />
          <input value={config.tagline} onChange={(event) => setConfig({ ...config, tagline: event.target.value })} className={inputClass()} placeholder="role / tagline" />
          <textarea value={config.bio} onChange={(event) => setConfig({ ...config, bio: event.target.value })} className={`${inputClass()} md:col-span-2 min-h-28`} placeholder="bio" />
          <input value={config.linkedinUrl} onChange={(event) => setConfig({ ...config, linkedinUrl: event.target.value })} className={inputClass()} placeholder="LinkedIn URL" />
          <input value={config.portfolioUrl} onChange={(event) => setConfig({ ...config, portfolioUrl: event.target.value })} className={inputClass()} placeholder="Portfolio URL" />
          <label className="theme-text-muted flex items-center gap-3 text-sm">
            <input type="checkbox" checked={config.linkedinVerified} onChange={(event) => setConfig({ ...config, linkedinVerified: event.target.checked })} />
            LinkedIn verified
          </label>
        </div>

        <div className="theme-panel grid gap-6 rounded-[24px] p-6 md:grid-cols-2">
          <div className="md:col-span-2">{sectionTitle("Platform handles", "These power the live stats on the back face.")}</div>
          <input value={config.handles.github} onChange={(event) => setConfig({ ...config, handles: { ...config.handles, github: event.target.value } })} className={inputClass()} placeholder="GitHub" />
          <input value={config.handles.leetcode} onChange={(event) => setConfig({ ...config, handles: { ...config.handles, leetcode: event.target.value } })} className={inputClass()} placeholder="LeetCode" />
          <input value={config.handles.codeforces} onChange={(event) => setConfig({ ...config, handles: { ...config.handles, codeforces: event.target.value } })} className={inputClass()} placeholder="Codeforces" />
          <input value={config.handles.gfg} onChange={(event) => setConfig({ ...config, handles: { ...config.handles, gfg: event.target.value } })} className={inputClass()} placeholder="GeeksforGeeks" />
        </div>

        <div className="theme-panel rounded-[24px] p-6">
          {sectionTitle("Experience", "Three timeline entries appear on the front face.")}
          <div className="space-y-4">
            {config.experience.map((entry, index) => (
              <div key={`${entry.role}-${index}`} className="theme-subpanel grid gap-3 rounded-[18px] p-4 md:grid-cols-[1fr_1fr_1fr_70px_40px]">
                <input value={entry.role} onChange={(event) => updateExperience(index, { role: event.target.value })} className={inputClass()} placeholder="Role" />
                <input value={entry.company} onChange={(event) => updateExperience(index, { company: event.target.value })} className={inputClass()} placeholder="Company" />
                <input value={entry.period} onChange={(event) => updateExperience(index, { period: event.target.value })} className={inputClass()} placeholder="2024–Present" />
                <input value={entry.initial} onChange={(event) => updateExperience(index, { initial: event.target.value })} className={inputClass()} placeholder="BT" />
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, experience: config.experience.filter((_, itemIndex) => itemIndex !== index) })}
                  className="theme-button-secondary theme-text-muted inline-flex items-center justify-center rounded-[14px]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setConfig({ ...config, experience: [...config.experience, { role: "", company: "", period: "", initial: "" }] })}
            className="theme-button-secondary mt-4 inline-flex items-center gap-2 rounded-[14px] px-4 py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </button>
        </div>

        <div className="theme-panel rounded-[24px] p-6">
          {sectionTitle("Skills", "Up to 8 pills appear on the front face.")}
          <textarea
            value={config.skills.join(", ")}
            onChange={(event) =>
              setConfig({
                ...config,
                skills: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .slice(0, 8),
              })
            }
            className={`${inputClass()} min-h-24`}
            placeholder="React, Node.js, TypeScript"
          />
        </div>

        <div className="theme-panel rounded-[24px] p-6">
          {sectionTitle("Fun zone", "Choose the footer content shown on the visible cover card.")}
          <FunZonePicker type={config.funZone.type} value={config.funZone.value} onChange={(next) => setConfig({ ...config, funZone: next })} />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[var(--cream-base)] px-5 py-3 text-sm font-medium text-[#111] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save card"}
          </button>
          <p className="theme-text-muted text-sm">{message}</p>
        </div>
      </section>

      <LivePreview config={config} onAvatarSelect={(value) => setConfig((current) => ({ ...current, avatarUrl: value }))} />
    </main>
  );
}
