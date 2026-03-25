import { Skeleton } from "@/components/ui/Skeleton";

export function CardSkeleton() {
  return (
    <div className="h-[215px] w-[340px] overflow-hidden rounded-[18px] border border-white/10 bg-white/5 p-5 shadow-card md:h-[240px] md:w-[380px]">
      <div className="relative h-full overflow-hidden rounded-[14px] bg-slate-950/60">
        <div className="flex h-full flex-col gap-3 p-4">
          <Skeleton width={120} height={12} radius={6} />
          <Skeleton width={200} height={12} radius={6} />
          <Skeleton width="90%" height={10} radius={5} />
          <Skeleton width="76%" height={10} radius={5} />
          <div className="mt-auto">
            <Skeleton width={140} height={14} radius={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
