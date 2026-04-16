import { Skeleton } from "@/components/ui/Skeleton";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      <div className="grid gap-3">
        <Skeleton width="45%" height={12} radius={999} />
        <Skeleton width="82%" height={18} radius={10} />
        <Skeleton width="64%" height={12} radius={999} />
        <Skeleton width="72%" height={12} radius={999} />
        <div className="mt-2 grid gap-2">
          <Skeleton width="100%" height={10} radius={999} />
          <Skeleton width="88%" height={10} radius={999} />
          <Skeleton width="78%" height={10} radius={999} />
        </div>
      </div>
    </div>
  );
}
