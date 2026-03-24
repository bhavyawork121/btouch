import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { clearAllCaches } from "@/lib/dbCache";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { card: true },
  });

  if (!user?.card) {
    return NextResponse.json({ error: "Card configuration not found" }, { status: 404 });
  }

  await clearAllCaches(user.card.username);

  return NextResponse.json({ ok: true, username: user.card.username });
}
