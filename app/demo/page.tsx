import { FlipCard } from "@/components/card/FlipCard";
import { getDemoCardData } from "@/lib/demo-card";

export default function DemoPage() {
  const demoCard = getDemoCardData();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
      <div className="absolute inset-0 card-grid opacity-40" />
      <div className="relative flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Demo</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white">Build your own card</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            This route shows a sample public card with the compact and full views.
          </p>
        </div>
        <FlipCard data={demoCard} username={demoCard.config.username} />
      </div>
    </main>
  );
}
