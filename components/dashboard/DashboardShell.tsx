"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import type { CardData } from "@/types/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { EditCardForm } from "@/components/dashboard/EditCardForm";
import { LivePreview } from "@/components/dashboard/LivePreview";
import { useCardForm } from "@/hooks/useCardForm";
import { getAccentByName } from "@/lib/constants/accentColors";

interface DashboardShellProps {
  preview: CardData;
  publicUrl: string;
}

export function DashboardShell({ preview, publicUrl }: DashboardShellProps) {
  const reduceMotion = useReducedMotion();
  const formState = useCardForm({ initialPreview: preview, storageKey: "btouch-dashboard-draft" });
  const [activeItem, setActiveItem] = useState<"my-card" | "preview" | "refresh" | "settings">("my-card");

  const accent = getAccentByName(formState.form.accentColor);
  const displayName = formState.form.displayName || preview.profile.displayName || preview.config.username || "btouch";
  const avatarUrl = formState.form.avatarUrl || preview.profile.avatarUrl || null;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent.hex);
    root.style.setProperty("--accent-rgb", accent.rgb);
  }, [accent.hex, accent.rgb]);

  const shellStyle = useMemo(
    () =>
      ({
        "--accent": accent.hex,
        "--accent-rgb": accent.rgb,
        backgroundColor: "#0a0a0f",
        backgroundImage:
          "radial-gradient(circle at 16% 14%, rgb(var(--accent-rgb) / 0.16), transparent 24%), radial-gradient(circle at 82% 20%, rgb(14 165 233 / 0.12), transparent 22%), radial-gradient(circle at 50% 82%, rgb(255 255 255 / 0.05), transparent 30%)",
      }) as CSSProperties,
    [accent.hex, accent.rgb],
  );

  async function handleSave() {
    const result = await formState.save();
    if (result.ok) {
      toast.success("Saved card changes");
    } else {
      toast.error(result.message);
    }
    return result;
  }

  async function handleRefresh() {
    const ok = await formState.refresh();
    if (ok) {
      toast.success("Stats refresh started");
    } else {
      toast.error("Unable to refresh stats");
    }
    return ok;
  }

  function scrollTo(section: "my-card" | "preview" | "refresh" | "settings") {
    setActiveItem(section);
    if (section === "preview") {
      toast.message("Preview is pinned on the right");
      return;
    }

    const target = section === "my-card" ? "identity" : section === "refresh" ? "competitive" : "appearance";
    document.getElementById(target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <motion.main
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="relative h-screen overflow-hidden text-white"
      style={shellStyle}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full w-[240px]"
          style={{
            backgroundImage:
              "radial-gradient(circle at top, rgb(var(--accent-rgb) / 0.2), transparent 45%), linear-gradient(180deg, rgb(255 255 255 / 0.03), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="relative z-10 flex h-full">
        <Sidebar
          activeItem={activeItem}
          displayName={displayName}
          avatarUrl={avatarUrl}
          username={formState.form.username || preview.config.username}
          publicUrl={publicUrl}
          onNavigate={scrollTo}
        />

        <section className="flex min-w-0 flex-1 flex-col border-r border-white/8 bg-white/[0.02]">
          <EditCardForm formState={formState} onSave={handleSave} onRefresh={handleRefresh} />
        </section>

        <LivePreview
          previewData={formState.previewData}
          publicUrl={publicUrl}
          onSave={handleSave}
          onRefresh={handleRefresh}
          isSaving={formState.isSaving}
          isRefreshing={formState.isRefreshing}
          hasChanges={formState.hasChanges}
        />
      </div>
    </motion.main>
  );
}
