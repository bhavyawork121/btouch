"use client";

import { RouteErrorState } from "@/components/ui/RouteErrorState";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Dashboard failed to load."
      message="The authenticated dashboard hit an unexpected error. Retry the route to request fresh server data."
      onAction={reset}
    />
  );
}
