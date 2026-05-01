import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CardCase } from "@/components/card/CardCase";
import { getUserConfig } from "@/lib/btouch";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const user = await getUserConfig(params.username);
  if (!user) {
    return { title: "Not found" };
  }

  return {
    title: `${user.name} — Developer Card`,
    description: user.bio,
    openGraph: {
      images: [`/api/og?username=${params.username}`],
    },
  };
}

export default async function CardPage({ params }: { params: { username: string } }) {
  const config = await getUserConfig(params.username);
  if (!config) {
    notFound();
  }

  return (
    <main className="theme-shell theme-content flex min-h-screen flex-col items-center px-4 pt-7">
      <CardCase config={config} />
      <p className="theme-text-faint mt-4 text-[11px]">powered by btouch</p>
    </main>
  );
}
