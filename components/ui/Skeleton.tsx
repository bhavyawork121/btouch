export function Skeleton({
  width = "100%",
  height = 14,
  radius = 4,
}: {
  width?: number | string;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "rgba(255,255,255,0.06)",
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}
