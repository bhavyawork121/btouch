"use client";

import { BookOpen, Code2, Terminal } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CardFormValidation, CardFormValues } from "@/hooks/useCardForm";

type UpdateField = <K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) => void;

interface CompetitiveSectionProps {
  form: CardFormValues;
  validation: CardFormValidation;
  updateField: UpdateField;
}

export function CompetitiveSection({ form, validation, updateField }: CompetitiveSectionProps) {
  return (
    <section id="competitive" className="scroll-mt-8">
      <SectionHeader
        eyebrow="Competitive"
        title="Coding platform handles"
        description="These handles let btouch fetch live stats from the supported platforms."
        delay={0.15}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <GlassInput
          label="LeetCode"
          icon={<Code2 className="h-4 w-4" />}
          value={form.leetcodeHandle}
          onChange={(event) => updateField("leetcodeHandle", event.target.value)}
          valid={validation.leetcodeHandle.valid}
          error={validation.leetcodeHandle.error}
          helpText="Username or profile slug."
        />
        <GlassInput
          label="Codeforces"
          icon={<Terminal className="h-4 w-4" />}
          value={form.cfHandle}
          onChange={(event) => updateField("cfHandle", event.target.value)}
          valid={validation.cfHandle.valid}
          error={validation.cfHandle.error}
          helpText="Your Codeforces profile handle."
        />
        <GlassInput
          label="GFG"
          icon={<BookOpen className="h-4 w-4" />}
          value={form.gfgHandle}
          onChange={(event) => updateField("gfgHandle", event.target.value)}
          valid={validation.gfgHandle.valid}
          error={validation.gfgHandle.error}
          helpText="GeeksforGeeks username."
        />
      </div>
    </section>
  );
}
