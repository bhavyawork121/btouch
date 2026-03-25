import { notFound } from "next/navigation";
import { PublicCardShell } from "@/components/card/PublicCardShell";
import { auth } from "@/lib/auth";
import { getCardDataByUsername } from "@/lib/card-service";

export default async function PublicCardPage({ params }: { params: { username: string } }) {
  const session = await auth();
  const card = await getCardDataByUsername(params.username);

  if (!card) {
    notFound();
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${params.username}`;
  const isOwner = Boolean(session?.user && (session.user as { cardUsername?: string | null }).cardUsername === params.username);

  return <PublicCardShell initialData={card} shareUrl={shareUrl} username={params.username} isOwner={isOwner} />;
}
