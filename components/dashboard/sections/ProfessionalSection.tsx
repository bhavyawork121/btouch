"use client";

import { Briefcase, AlignLeft, Building2 } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CardFormValidation, CardFormValues } from "@/hooks/useCardForm";

type UpdateField = <K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) => void;

interface ProfessionalSectionProps {
  form: CardFormValues;
  validation: CardFormValidation;
  updateField: UpdateField;
}

export function ProfessionalSection({ form, validation, updateField }: ProfessionalSectionProps) {
  return (
    <section id="professional" className="scroll-mt-8">
      <SectionHeader
        eyebrow="Professional"
        title="Context and signal"
        description="Headline and bio drive the body of the public card, while role and company give the layout structure."
        delay={0.05}
      />
      <div className="grid gap-4">
        <GlassInput
          label="Headline"
          icon={<Briefcase className="h-4 w-4" />}
          value={form.headline}
          onChange={(event) => updateField("headline", event.target.value)}
          valid={validation.headline.valid}
          error={validation.headline.error}
          helpText="A short sentence that explains what you do."
          maxLength={120}
        />
        <GlassInput
          textarea
          label="Bio"
          icon={<AlignLeft className="h-4 w-4" />}
          value={form.bio}
          onChange={(event) => updateField("bio", event.target.value)}
          valid={validation.bio.valid}
          error={validation.bio.error}
          helpText="A slightly longer summary for the public profile."
          rows={4}
          maxLength={500}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassInput
            label="Current role"
            icon={<Building2 className="h-4 w-4" />}
            value={form.currentRole}
            onChange={(event) => updateField("currentRole", event.target.value)}
            helpText="Optional, but useful for the live preview card."
          />
          <GlassInput
            label="Current company"
            icon={<Briefcase className="h-4 w-4" />}
            value={form.currentCompany}
            onChange={(event) => updateField("currentCompany", event.target.value)}
            helpText="Shown with the role in the experience area."
          />
        </div>
      </div>
    </section>
  );
}
