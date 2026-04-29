import { generateQrSvg } from "@/lib/qr";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url") || "https://example.com";
  const svg = await generateQrSvg(url);
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
