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
    <aside className="sticky top-8 flex justify-center rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-6">
      <CardCase config={config} editable onAvatarSelect={onAvatarSelect} />
    </aside>
  );
}
