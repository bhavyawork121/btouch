import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Trophy } from "lucide-react";
import { FlipCard } from "@/components/card/FlipCard";
import { buildPreviewCardData } from "@/lib/normalize";
import { getThemeSurface, resolveTheme } from "@/lib/theme";

const QRExport = dynamic(() => import("@/components/ui/QRExport").then((mod) => mod.QRExport), {
  ssr: false,
});

const previewData = buildPreviewCardData();
const previewSurface = getThemeSurface(resolveTheme(previewData.appearance.theme, true));

export default function Home() {
  return (
    <main className="relative overflow-hidden" style={{ background: previewSurface.background, color: previewSurface.foreground }}>
      <div className="absolute inset-0 card-grid opacity-40" />
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-platform-linkedin" />
            Public developer cards with live platform stats
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
              One card. Two faces. All of your developer identity.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300 text-balance">
              btouch turns your LinkedIn presence and coding platform history into an animated flip card that feels built, not generated.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:-translate-y-0.5"
            >
              Build your card
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rahul-s"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              View live example
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Linkedin className="mb-3 h-5 w-5 text-platform-linkedin" />
              <p className="font-medium text-white">LinkedIn front</p>
              <p className="mt-1 text-sm text-slate-300">Profile identity tuned for first impression.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Github className="mb-3 h-5 w-5 text-platform-github" />
              <p className="font-medium text-white">Live coding stats</p>
              <p className="mt-1 text-sm text-slate-300">GitHub, LeetCode, Codeforces, and GFG in one view.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Trophy className="mb-3 h-5 w-5 text-platform-leetcode" />
              <p className="font-medium text-white">Shareable URL</p>
              <p className="mt-1 text-sm text-slate-300">Optimized SSR card pages and QR export for sharing.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-5">
          <FlipCard data={previewData} username="rahul-s" />
          <QRExport url="https://btouch.dev/rahul-s" title="Share Rahul's card" />
        </div>
      </section>
    </main>
  );
}
