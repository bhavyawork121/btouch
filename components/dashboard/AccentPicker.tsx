"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { accentSwatchGroups, accentSwatches, type AccentSwatch } from "@/lib/constants/accentColors";

interface AccentPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function moveFocus(current: AccentSwatch, direction: 1 | -1) {
  const index = accentSwatches.findIndex((swatch) => swatch.key === current.key);
  const nextIndex = (index + direction + accentSwatches.length) % accentSwatches.length;
  return accentSwatches[nextIndex];
}

export function AccentPicker({ value, onChange }: AccentPickerProps) {
  const reduceMotion = useReducedMotion();
  const selected = useMemo(() => accentSwatches.find((swatch) => swatch.name === value) ?? accentSwatches[0], [value]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  return (
    <div className="space-y-5">
      {accentSwatchGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: groupIndex * 0.05 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">{group.title}</p>
            <span className="text-xs text-white/30">{group.items.length} swatches</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {group.items.map((swatch) => {
              const isSelected = swatch.name === selected.name;
              return (
                <button
                  key={swatch.key}
                  ref={(node) => {
                    refs.current[swatch.key] = node;
                  }}
                  type="button"
                  title={swatch.name}
                  aria-label={`Select ${swatch.name} accent`}
                  className="group relative h-9 w-9 rounded-xl border border-white/10 transition will-change-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                  style={{
                    background: swatch.hex,
                    transform: isSelected ? "scale(1.1)" : "scale(1)",
                    boxShadow: isSelected ? `0 0 0 2px rgba(255,255,255,0.95), 0 0 0 6px rgb(${swatch.rgb} / 0.2)` : "none",
                  }}
                  onClick={() => onChange(swatch.name)}
                  onKeyDown={(event) => {
                    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    let next = selected;
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = moveFocus(selected, 1);
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = moveFocus(selected, -1);
                    if (event.key === "Home") next = accentSwatches[0];
                    if (event.key === "End") next = accentSwatches[accentSwatches.length - 1];
                    onChange(next.name);
                    refs.current[next.key]?.focus();
                  }}
                >
                  <span className="absolute inset-0 rounded-xl bg-white/0 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100" />
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
