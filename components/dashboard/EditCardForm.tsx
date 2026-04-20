"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { IdentitySection } from "@/components/dashboard/sections/IdentitySection";
import { ProfessionalSection } from "@/components/dashboard/sections/ProfessionalSection";
import { SocialSection } from "@/components/dashboard/sections/SocialSection";
import { CompetitiveSection } from "@/components/dashboard/sections/CompetitiveSection";
import { AppearanceSection } from "@/components/dashboard/sections/AppearanceSection";
import type { UseCardFormReturn } from "@/hooks/useCardForm";

interface EditCardFormProps {
  formState: UseCardFormReturn;
  onSave: () => Promise<unknown>;
  onRefresh: () => Promise<unknown>;
}

function SaveMark({ saving }: { saving: boolean }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${saving ? "border border-white/20" : "bg-emerald-500/20 text-emerald-300"}`}>
      {saving ? (
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <motion.svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-emerald-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.path d="M20 6L9 17l-5-5" />
        </motion.svg>
      )}
    </span>
  );
}

export function EditCardForm({ formState, onSave, onRefresh }: EditCardFormProps) {
  const reduceMotion = useReducedMotion();
  const { form, validation, updateField, isSaving, isRefreshing, hasChanges, saveState } = formState;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-20 border-b border-white/8 bg-[#0a0a0f]/80 px-6 py-5 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/35">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Edit your public card</h1>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 md:flex">
            {hasChanges ? "unsaved changes" : "all changes saved"}
          </div>
        </div>
      </motion.header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-10">
          <IdentitySection form={form} validation={validation} updateField={updateField} />
          <ProfessionalSection form={form} validation={validation} updateField={updateField} />
          <SocialSection form={form} validation={validation} updateField={updateField} />
          <CompetitiveSection form={form} validation={validation} updateField={updateField} />
          <AppearanceSection form={form} updateField={updateField} />
        </div>
      </div>

      <motion.footer
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky bottom-0 z-20 border-t border-white/8 bg-[#0a0a0f]/90 px-6 py-4 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm text-white/55">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[color:var(--accent)]" : "text-white/30"}`} />
            <span>We fetch your stats automatically once connected.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await onRefresh();
              }}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/10 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Stats"}
            </button>

            <motion.button
              type="button"
              onClick={async () => {
                await onSave();
              }}
              disabled={isSaving}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/35 bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
            >
              <SaveMark saving={isSaving} />
              {isSaving ? "Saving..." : saveState?.ok ? "Saved ✓" : "Save Card"}
            </motion.button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
