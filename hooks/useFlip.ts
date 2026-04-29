"use client";

import { useState } from "react";

export function useFlip() {
  const [flipped, setFlipped] = useState(false);
  return { flipped, flip: () => setFlipped((value) => !value), setFlipped };
}
