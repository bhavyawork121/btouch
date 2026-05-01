"use client";

import type { UserConfig } from "@/types/stats";
import { CardCase } from "@/components/card/CardCase";

export function LivePreview({
  config,
  onAvatarSelect,
}: {
  config: UserConfig;
  onAvatarSelect: (value: string) => void;
}) {
  return (
    <aside className="theme-preview-shell sticky top-8 flex justify-center rounded-[28px] p-6">
      <CardCase config={config} editable onAvatarSelect={onAvatarSelect} />
    </aside>
  );
}
