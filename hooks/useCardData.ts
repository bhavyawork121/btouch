"use client";

import { useQuery } from "@tanstack/react-query";
import type { CardData } from "@/types/card";

export function useCardData(username: string, initialData?: CardData) {
  return useQuery<CardData>({
    queryKey: ["card", username],
    queryFn: async () => {
      const response = await fetch(`/api/card/${username}`);

      if (!response.ok) {
        throw new Error("Unable to load card data");
      }

      return (await response.json()) as CardData;
    },
    enabled: username.length > 1,
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}
