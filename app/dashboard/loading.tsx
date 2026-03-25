import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="page-enter flex min-h-screen items-center justify-center bg-[#060810] px-6 py-10">
      <Skeleton width="100%" height={160} radius={24} />
    </main>
  );
}
