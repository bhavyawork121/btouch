import Image from "next/image";

export function Avatar({ src, alt, size = 56 }: { src: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden border border-white/10 bg-white/10 font-display text-[18px] font-semibold text-white"
        style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, boxShadow: "0 0 0 2px rgba(99,102,241,0.2)" }}
      >
        {alt.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-white/10" style={{ width: size, height: size, borderRadius: "50%", boxShadow: "0 0 0 2px rgba(99,102,241,0.2)" }}>
      <Image src={src} alt={alt} width={size} height={size} className="h-full w-full object-cover" />
    </div>
  );
}
