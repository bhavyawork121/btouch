export function CardSkeleton() {
  return (
    <div className="h-[215px] w-[340px] overflow-hidden rounded-[18px] border border-white/10 bg-white/5 p-5 shadow-card md:h-[240px] md:w-[380px]">
      <div className="relative h-full overflow-hidden rounded-[14px] bg-slate-950/60">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
