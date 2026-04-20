"use client";

import { Type, User } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CardFormValidation, CardFormValues } from "@/hooks/useCardForm";

type UpdateField = <K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) => void;

interface IdentitySectionProps {
  form: CardFormValues;
  validation: CardFormValidation;
  updateField: UpdateField;
}

export function IdentitySection({ form, validation, updateField }: IdentitySectionProps) {
  return (
    <section id="identity" className="scroll-mt-8">
      <SectionHeader
        eyebrow="Identity"
        title="Your public identity"
        description="The username and display name that shape the public card header."
        delay={0}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <GlassInput
          label="Public username"
          icon={<User className="h-4 w-4" />}
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
          valid={validation.username.valid}
          error={validation.username.error}
          helpText="Used in your btouch.dev/username public page."
          autoComplete="username"
        />
        <GlassInput
          label="Display name"
          icon={<Type className="h-4 w-4" />}
          value={form.displayName}
          onChange={(event) => updateField("displayName", event.target.value)}
          valid={validation.displayName.valid}
          error={validation.displayName.error}
          helpText="Shown prominently on the front of your card."
          autoComplete="name"
        />
      </div>
    </section>
  );
}
