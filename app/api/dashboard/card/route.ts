import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getDashboardConfig, saveDashboardConfig } from "@/lib/btouch";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getDashboardConfig(session.user.email);
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const saved = await saveDashboardConfig(session.user.id, payload);

  revalidatePath("/dashboard");
  revalidatePath(`/${saved.username}`);

  return NextResponse.json({ ok: true, username: saved.username });
}
