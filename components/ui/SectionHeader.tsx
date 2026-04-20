"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  delay?: number;
}

export function SectionHeader({ eyebrow, title, description, delay = 0 }: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="mb-4"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">{eyebrow}</p>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">{description}</p> : null}
        </div>
      </div>
    </motion.div>
  );
}
