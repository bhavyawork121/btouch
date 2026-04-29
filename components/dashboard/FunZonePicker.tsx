"use client";

const emojiOptions = ["🚀", "⚡", "💻", "🎯", "🔥", "🧠", "🛠", "📐", "🌐", "🎓", "🏆", "✨", "🤖", "📊", "🎸", "🐢", "☕", "🌙", "🦊", "🐉", "🎲"];
const quoteOptions = [
  "First, solve the problem. Then, write the code.",
  "Make it work, make it right, make it fast.",
  "Talk is cheap. Show me the code.",
  "Simplicity is the soul of efficiency.",
  "Any fool can write code that a computer can understand.",
  "Code is like humour. When you have to explain it, it's bad.",
];

export function FunZonePicker({
  type,
  value,
  onChange,
}: {
  type: "emoji" | "quote" | "custom";
  value: string;
  onChange: (next: { type: "emoji" | "quote" | "custom"; value: string }) => void;
}) {
  const tabs: Array<"emoji" | "quote" | "custom"> = ["emoji", "quote", "custom"];

  return (
    <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange({ type: tab, value: tab === type ? value : tab === "emoji" ? "🚀" : tab === "quote" ? quoteOptions[0] : "" })}
            className={`rounded-full px-3 py-2 text-xs uppercase tracking-[0.14em] ${type === tab ? "bg-[var(--cream-base)] text-[#111]" : "border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.55)]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {type === "emoji" ? (
        <div className="grid grid-cols-7 gap-2">
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange({ type: "emoji", value: emoji })}
              className={`rounded-[10px] border px-0 py-2 text-lg ${value === emoji ? "border-[var(--cream-base)] bg-[rgba(255,255,255,0.08)]" : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]"}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}

      {type === "quote" ? (
        <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
          {quoteOptions.map((quote) => (
            <button
              key={quote}
              type="button"
              onClick={() => onChange({ type: "quote", value: quote })}
              className={`w-full rounded-[12px] border px-3 py-3 text-left text-sm ${value === quote ? "border-[var(--cream-base)] bg-[rgba(255,255,255,0.08)] text-white" : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.68)]"}`}
            >
              “{quote}”
            </button>
          ))}
        </div>
      ) : null}

      {type === "custom" ? (
        <input
          value={value}
          maxLength={60}
          onChange={(event) => onChange({ type: "custom", value: event.target.value })}
          className="w-full rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white outline-none"
          placeholder="Write your own footer line"
        />
      ) : null}
    </div>
  );
}
