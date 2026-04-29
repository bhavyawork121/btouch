"use client";

import { motion } from "framer-motion";
import type { PlatformStats, UserConfig } from "@/types/stats";
import { useFlip } from "@/hooks/useFlip";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";
import { SkeletonBack } from "./SkeletonBack";

export function CardInner({
  config,
  stats,
  loading,
  editable,
  onAvatarSelect,
}: {
  config: UserConfig;
  stats: PlatformStats | undefined;
  loading: boolean;
  editable?: boolean;
  onAvatarSelect?: (value: string) => void;
}) {
  const { flipped, setFlipped } = useFlip();

  return (
    <div style={{ perspective: 1400, width: 300, height: 499 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.84, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
          <CardFront config={config} stats={stats ?? { github: null, leetcode: null, codeforces: null, gfg: null, devScore: 0, percentile: "Keep grinding", lastUpdated: new Date().toISOString(), activity: [] }} onFlip={() => setFlipped(true)} editable={editable} onAvatarSelect={onAvatarSelect} />
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          {loading || !stats ? <SkeletonBack /> : <CardBack handles={config.handles} stats={stats} onFlip={() => setFlipped(false)} />}
        </div>
      </motion.div>
    </div>
  );
}
