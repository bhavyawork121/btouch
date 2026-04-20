"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AccentPicker } from "@/components/dashboard/AccentPicker";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CardFormValues } from "@/hooks/useCardForm";

type UpdateField = <K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) => void;

function ThemeToggle({
  value,
  onChange,
}: {
  value: CardFormValues["theme"];
  onChange: (value: CardFormValues["theme"]) => void;
}) {
  const reduceMotion = useReducedMotion();
  const isDark = value !== "light";

  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? "light" : "dark")}
      className="relative flex h-12 w-full items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 transition hover:border-white/20"
      aria-label="Toggle theme"
    >
      <span className="relative z-10 flex items-center gap-2">
        <SunMedium className={`h-4 w-4 transition ${isDark ? "text-white/30" : "text-amber-300"}`} />
        Light
      </span>
      <span className="relative z-10 flex items-center gap-2">
        Dark
        <MoonStar className={`h-4 w-4 transition ${isDark ? "text-cyan-200" : "text-white/30"}`} />
      </span>
      <motion.span
        layout
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
        className="absolute top-1 h-10 w-[calc(50%-0.25rem)] rounded-xl"
        style={{
          left: isDark ? 4 : "calc(50% + 4px)",
          backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
          boxShadow: "0 0 30px color-mix(in srgb, var(--accent) 24%, transparent)",
        }}
      />
    </button>
  );
}

interface AppearanceSectionProps {
  form: CardFormValues;
  updateField: UpdateField;
}

export function AppearanceSection({ form, updateField }: AppearanceSectionProps) {
  return (
    <section id="appearance" className="scroll-mt-8">
      <SectionHeader
        eyebrow="Appearance"
        title="Theme and accent"
        description="Choose a theme and push the accent color across the entire dashboard instantly."
        delay={0.2}
      />
      <div className="grid gap-5">
        <ThemeToggle value={form.theme} onChange={(value) => updateField("theme", value)} />
        <AccentPicker value={form.accentColor} onChange={(value) => updateField("accentColor", value)} />
      </div>
    </section>
  );
}
