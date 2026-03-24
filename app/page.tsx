import Link from "next/link";
import { ArrowRight, Github, Linkedin, Trophy } from "lucide-react";
import { auth } from "@/lib/auth";
import { homeCopy } from "@/lib/copy";
import { OnboardingCard } from "@/components/card/OnboardingCard";

export default async function Home() {
  const session = await auth();
  const exampleHref = session?.user ? `/${(session.user as { cardUsername?: string | null }).cardUsername ?? "demo"}` : "/demo";

  return (
    <main className="relative overflow-hidden text-white">
      <div className="absolute inset-0 card-grid opacity-40" />
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-platform-linkedin" />
            {homeCopy.badge}
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl whitespace-pre-line font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
              {homeCopy.headline}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300 text-balance">{homeCopy.sub}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:-translate-y-0.5"
            >
              {homeCopy.cta1}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={exampleHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              {homeCopy.cta2}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Linkedin className="mb-3 h-5 w-5 text-platform-linkedin" />
              <p className="font-medium text-white">{homeCopy.features[0].title}</p>
              <p className="mt-1 text-sm text-slate-300">{homeCopy.features[0].desc}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Github className="mb-3 h-5 w-5 text-platform-github" />
              <p className="font-medium text-white">{homeCopy.features[1].title}</p>
              <p className="mt-1 text-sm text-slate-300">{homeCopy.features[1].desc}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Trophy className="mb-3 h-5 w-5 text-platform-leetcode" />
              <p className="font-medium text-white">{homeCopy.features[2].title}</p>
              <p className="mt-1 text-sm text-slate-300">{homeCopy.features[2].desc}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-5">
          <OnboardingCard />
        </div>
      </section>
    </main>
  );
}
