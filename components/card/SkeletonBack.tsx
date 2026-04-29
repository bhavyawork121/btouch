export function SkeletonBack() {
  return (
    <div className="relative h-[499px] w-[300px] overflow-hidden rounded-[14px] border border-[#222] bg-[var(--bg-card-back)] text-[var(--back-text)]">
      <div className="flex items-center justify-between border-b border-[#1e1e1e] bg-[#0a0a0a] px-[14px] py-[10px]">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
        <div className="h-3 w-16 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
      </div>
      <div className="h-[2px] bg-[var(--accent-dark)]" />
      <div className="h-[22px] border-y border-[#151515] bg-[#070707]" />
      <div className="space-y-4 px-[14px] py-[11px]">
        <div className="rounded-[9px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.025)] p-[10px]">
          {[60, 75, 45, 80].map((width, index) => (
            <div key={width} className={`flex items-center justify-between ${index < 3 ? "border-b border-[rgba(255,255,255,0.04)]" : ""} py-[7px]`}>
              <div className="h-3 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" style={{ width: `${width}%` }} />
              <div className="h-3 w-20 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
            </div>
          ))}
        </div>
        <div className="rounded-[9px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-[9px]">
          <div className="grid grid-cols-[26px_repeat(7,1fr)] gap-[2px]">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center">
                <span className={`block rounded-[2px] ${index > 7 ? "h-[8px] w-[8px] bg-[rgba(255,255,255,0.07)]" : ""}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-[10px]">
          <div className="space-y-3">
            <div className="h-3 w-20 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
            <div className="h-8 w-16 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
          </div>
          <div className="h-[58px] w-[58px] rounded-full border-[5px] border-[rgba(255,255,255,0.05)]" />
        </div>
      </div>
    </div>
  );
}
