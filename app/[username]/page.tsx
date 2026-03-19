import { notFound } from "next/navigation";
import { PublicCardShell } from "@/components/card/PublicCardShell";
import { getCardDataByUsername } from "@/lib/card-service";

export default async function PublicCardPage({ params }: { params: { username: string } }) {
  const card = await getCardDataByUsername(params.username);

  if (!card) {
    notFound();
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${params.username}`;

  return <PublicCardShell initialData={card} shareUrl={shareUrl} username={params.username} />;
}
