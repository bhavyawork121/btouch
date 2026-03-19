import { CardSkeleton } from "@/components/card/CardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
      <CardSkeleton />
    </main>
  );
}
