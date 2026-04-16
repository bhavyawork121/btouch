"use client";

import { useEffect, useMemo, useState } from "react";

export interface AppearanceValue {
  cardBackground: string;
  cardFont: "inter" | "space-grotesk" | "cal-sans";
  cardTheme: "auto" | "light" | "dark";
  particleEnabled: boolean;
}

interface AppearancePickerProps {
  value: AppearanceValue;
  onChange: (value: AppearanceValue) => void;
  condensed?: boolean;
  className?: string;
}

const BACKGROUNDS = [
  { key: "gradient-aurora", label: "Aurora", value: "gradient-aurora", swatch: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { key: "gradient-ocean", label: "Ocean", value: "gradient-ocean", swatch: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  { key: "gradient-sunset", label: "Sunset", value: "gradient-sunset", swatch: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { key: "gradient-forest", label: "Forest", value: "gradient-forest", swatch: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { key: "gradient-midnight", label: "Midnight", value: "gradient-midnight", swatch: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { key: "gradient-gold", label: "Gold", value: "gradient-gold", swatch: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
] as const;

function parseCustomGradient(value: string) {
  const match = value.match(/^custom:([^,]+),([^,]+)$/i);
  if (!match) {
    return { from: "#667eea", to: "#764ba2" };
  }

  return {
    from: match[1].trim(),
    to: match[2].trim(),
  };
}

function buildCustomGradient(from: string, to: string) {
  return `custom:${from},${to}`;
}

export function AppearancePicker({ value, onChange, condensed = false, className }: AppearancePickerProps) {
  const [customFrom, setCustomFrom] = useState("#667eea");
  const [customTo, setCustomTo] = useState("#764ba2");

  const selectedCustom = useMemo(() => value.cardBackground.startsWith("custom:"), [value.cardBackground]);

  useEffect(() => {
    if (selectedCustom) {
      const parsed = parseCustomGradient(value.cardBackground);
      setCustomFrom(parsed.from);
      setCustomTo(parsed.to);
    }
  }, [selectedCustom, value.cardBackground]);

  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>('link[data-btouch-calsans="true"]');
    if (existing) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/cal-sans";
    link.dataset.btouchCalsans = "true";
    document.head.appendChild(link);
  }, []);

  function update(next: Partial<AppearanceValue>) {
    onChange({ ...value, ...next });
  }

  function setCustomGradient(from: string, to: string) {
    setCustomFrom(from);
    setCustomTo(to);
    update({ cardBackground: buildCustomGradient(from, to) });
  }

  return (
    <div className={["grid gap-6", className ?? ""].join(" ")}>
      <section className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-white">Background</p>
          <p className="text-xs text-white/55">Pick a preset or blend your own colors.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {BACKGROUNDS.map((background) => {
            const active = value.cardBackground === background.value;

            return (
              <button
                key={background.key}
                type="button"
                onClick={() => update({ cardBackground: background.value })}
                aria-pressed={active}
                className={[
                  "flex min-h-11 flex-col items-center gap-2 rounded-2xl border p-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  active ? "border-white/35 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <span
                  className="h-10 w-10 rounded-full border border-white/15 shadow-lg shadow-black/20"
                  style={{ backgroundImage: background.swatch }}
                />
                <span className="text-[11px] text-white/75">{background.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => update({ cardBackground: buildCustomGradient(customFrom, customTo) })}
            aria-pressed={selectedCustom}
            className={[
              "flex min-h-11 flex-col items-center gap-2 rounded-2xl border p-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              selectedCustom ? "border-white/35 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10",
            ].join(" ")}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[linear-gradient(135deg,#667eea,#764ba2)] text-xs font-semibold text-white shadow-lg shadow-black/20"
            >
              Custom
            </span>
            <span className="text-[11px] text-white/75">Custom</span>
          </button>
        </div>

        {selectedCustom ? (
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/75">
              <span>From</span>
              <input
                type="color"
                value={customFrom}
                onChange={(event) => setCustomGradient(event.target.value, customTo)}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
                aria-label="Custom gradient start color"
              />
            </label>
            <label className="grid gap-2 text-sm text-white/75">
              <span>To</span>
              <input
                type="color"
                value={customTo}
                onChange={(event) => setCustomGradient(customFrom, event.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
                aria-label="Custom gradient end color"
              />
            </label>
          </div>
        ) : null}
      </section>

      <section className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-white">Font</p>
          <p className="text-xs text-white/55">Match the front face to your style.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {([
            ["inter", "Inter", "Your name · Developer", "var(--font-inter), var(--font-space-grotesk), sans-serif"],
            ["space-grotesk", "Space Grotesk", "Your name · Developer", "var(--font-space-grotesk), sans-serif"],
            ["cal-sans", "Cal Sans", "Your name · Developer", '"Cal Sans", var(--font-space-grotesk), sans-serif'],
          ] as const).map(([fontKey, fontLabel, sample, fontFamily]) => {
            const active = value.cardFont === fontKey;

            return (
              <button
                key={fontKey}
                type="button"
                onClick={() => update({ cardFont: fontKey })}
                aria-pressed={active}
                className={[
                  "grid gap-2 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  active ? "border-white/35 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-white/45">{fontLabel}</span>
                <span style={{ fontFamily }} className="text-sm text-white">
                  {sample}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {!condensed ? (
        <section className="grid gap-3">
          <div>
            <p className="text-sm font-medium text-white">Card theme</p>
            <p className="text-xs text-white/55">Controls the look of the stats face.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "auto", label: "Auto (system)" },
              { key: "light", label: "Light" },
              { key: "dark", label: "Dark" },
            ].map((option) => {
              const active = value.cardTheme === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => update({ cardTheme: option.key as AppearanceValue["cardTheme"] })}
                  aria-pressed={active}
                  className={[
                    "min-h-11 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    active ? "border-white/35 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-white">Particles</p>
          <p className="text-xs text-white/55">Soft floating dots on the front face.</p>
        </div>
        <button
          type="button"
          onClick={() => update({ particleEnabled: !value.particleEnabled })}
          aria-pressed={value.particleEnabled}
          className={[
            "flex min-h-11 items-center justify-between rounded-2xl border px-4 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            value.particleEnabled ? "border-white/35 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10",
          ].join(" ")}
        >
          <div className="text-left">
            <p className="text-sm text-white">Floating particles on card front</p>
            <p className="text-xs text-white/55">Respects reduced motion preferences.</p>
          </div>
          <span
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full border transition",
              value.particleEnabled ? "border-emerald-400/40 bg-emerald-400/25" : "border-white/15 bg-white/10",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                value.particleEnabled ? "translate-x-5" : "translate-x-1",
              ].join(" ")}
            />
          </span>
        </button>
      </section>
    </div>
  );
}
