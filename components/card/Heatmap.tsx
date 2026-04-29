import type { WeeklyActivity } from "@/types/stats";

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function opacityForLevel(level: number) {
  if (level <= 0) return 0.06;
  if (level === 1) return 0.28;
  if (level === 2) return 0.56;
  return 0.85;
}

export function Heatmap({ activity }: { activity: WeeklyActivity[] }) {
  return (
    <div className="rounded-[9px] border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] p-[9px]">
      <div className="grid grid-cols-[26px_repeat(7,1fr)] gap-[2px]">
        <div />
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-[8px] text-[rgba(216,210,200,0.2)]">
            {label}
          </div>
        ))}
        {activity.map((row) => (
          <div key={row.platform} className="contents">
            <div className="pr-2 text-[8px] text-[rgba(216,210,200,0.25)]">{row.abbr}</div>
            {row.days.map((value, index) => (
              <div key={`${row.platform}-${index}`} className="flex items-center justify-center">
                <span className="h-[8px] w-[8px] rounded-[2px]" style={{ background: row.color, opacity: opacityForLevel(value) }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
