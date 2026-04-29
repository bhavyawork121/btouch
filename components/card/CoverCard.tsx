import { Clock3, UserRound } from "lucide-react";
import type { UserConfig } from "@/types/stats";

function buildBarcode() {
  return Array.from({ length: 38 }, (_, index) => ({
    width: index % 3 === 0 ? 2 : 1.5,
    height: 8 + ((index * 7) % 11),
  }));
}

function renderFunZone(config: UserConfig) {
  const value = config.funZone.value || "🚀";
  if (config.funZone.type === "quote") {
    return <p className="font-serif text-[10px] italic leading-[1.55] text-[#777]">&quot;{value}&quot;</p>;
  }

  if (config.funZone.type === "custom") {
    return <p className="text-center text-[12px] font-medium text-[#444]">{value}</p>;
  }

  return <p className="text-center text-[20px] leading-[1.3] text-[#111]">{value}</p>;
}

export function CoverCard({ config }: { config: UserConfig }) {
  const barcode = buildBarcode();
  const meta = [
    { label: "ID No", value: `${config.initials || "BT"}-0042`, mono: true },
    { label: "Issued", value: "APR 2026" },
    { label: "Valid", value: "PUBLIC" },
    { label: "Status", value: "ACTIVE", success: true },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[12px] border border-[var(--cream-border)] bg-[var(--cream-base)] text-[var(--cream-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
      <div className="flex items-center justify-between bg-[var(--bg-window)] px-[14px] py-[11px]">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[rgba(216,210,200,0.25)]">btouch · developer identity</p>
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#333]">
          <Clock3 className="h-3.5 w-3.5 text-[#555]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="h-[2px] bg-[var(--accent-line)]" />
      <div className="flex h-[calc(100%-46px)] flex-col px-[14px] py-[14px]">
        <div className="flex gap-3">
          <div className="flex h-[60px] w-[48px] items-center justify-center rounded-[4px] border border-[#cac3b5] bg-[#e0dace]">
            {config.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.avatarUrl} alt={config.name} className="h-full w-full rounded-[4px] object-cover" />
            ) : (
              <UserRound className="h-6 w-6 text-[#989082]" strokeWidth={1.6} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-[16px] font-bold leading-[1.1] text-[#0d0d0d]">{config.name}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.05em] text-[#555]">{config.tagline || "Developer Identity"}</p>
            <p className="mt-2 line-clamp-3 text-[9.5px] leading-[1.55] text-[#888]">{config.bio || "A compact public profile built for sharing your developer identity."}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {meta.map((item) => (
            <div key={item.label} className="rounded-[5px] border border-[#c5beb0] bg-[var(--cream-mid)] px-[8px] py-[6px]">
              <p className="text-[8px] uppercase tracking-[0.08em] text-[#9a9080]">{item.label}</p>
              <p className={`mt-1 text-[11px] font-semibold ${item.mono ? "font-mono" : ""} ${item.success ? "text-[#2a6e3a]" : "text-[#111]"}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
          <div className="h-[6px] w-[6px] rounded-full bg-[#888]" />
          <div className="h-px flex-1 bg-[var(--cream-border)]" />
        </div>

        <div>
          <div className="flex items-end gap-[2px]">
            {barcode.map((bar, index) => (
              <span key={`${bar.width}-${index}`} className="block bg-[#aaa098]" style={{ width: bar.width, height: bar.height }} />
            ))}
          </div>
          <p className="mt-2 font-mono text-[8px] tracking-[0.14em] text-[#aaa098]">
            {`${config.name.toUpperCase().replace(/\s+/g, " · ")} · 0042`}
          </p>
        </div>

        <div className="mt-auto border-t border-[#cac3b5] px-[14px] py-[10px]">{renderFunZone(config)}</div>
      </div>
    </div>
  );
}
