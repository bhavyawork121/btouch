import { notFound } from "next/navigation";
import { FlipCard } from "@/components/card/FlipCard";
import { auth } from "@/lib/auth";
import { getCardDataByUsername } from "@/lib/card-service";

export default async function PublicCardPage({ params }: { params: { username: string } }) {
  const session = await auth();
  const card = await getCardDataByUsername(params.username);

  if (!card) {
    notFound();
  }

  const isOwner = Boolean(session?.user && (session.user as { cardUsername?: string | null }).cardUsername === params.username);

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <FlipCard data={card} username={params.username} isOwner={isOwner} emptyStateHref="/dashboard" />
      </div>
    </main>
  );
}
