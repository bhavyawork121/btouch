"use client";

import { Github, Image as ImageIcon, Linkedin } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CardFormValidation, CardFormValues } from "@/hooks/useCardForm";

type UpdateField = <K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) => void;

interface SocialSectionProps {
  form: CardFormValues;
  validation: CardFormValidation;
  updateField: UpdateField;
}

export function SocialSection({ form, validation, updateField }: SocialSectionProps) {
  return (
    <section id="social" className="scroll-mt-8">
      <SectionHeader
        eyebrow="Social Links"
        title="Photo and profile links"
        description="Use the avatar URL and handles to make the public card feel connected."
        delay={0.1}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <GlassInput
          label="Avatar URL"
          icon={<ImageIcon className="h-4 w-4" />}
          value={form.avatarUrl}
          onChange={(event) => updateField("avatarUrl", event.target.value)}
          valid={validation.avatarUrl.valid}
          error={validation.avatarUrl.error}
          helpText="Paste a direct image URL. We fall back to initials if invalid."
        />
        <GlassInput
          label="LinkedIn"
          icon={<Linkedin className="h-4 w-4" />}
          value={form.linkedinHandle}
          onChange={(event) => updateField("linkedinHandle", event.target.value)}
          valid={validation.linkedinHandle.valid}
          error={validation.linkedinHandle.error}
          helpText="Add your LinkedIn profile handle or URL."
        />
        <GlassInput
          label="GitHub"
          icon={<Github className="h-4 w-4" />}
          value={form.githubHandle}
          onChange={(event) => updateField("githubHandle", event.target.value)}
          valid={validation.githubHandle.valid}
          error={validation.githubHandle.error}
          helpText="We use this to hydrate coding stats."
        />
      </div>
    </section>
  );
}
