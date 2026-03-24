"use client";

import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function PublicCardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="This card could not be rendered."
      message="A runtime error interrupted the public card view. Retry the route, and if it keeps failing, refresh the page or try again later."
      onAction={reset}
    />
  );
}
