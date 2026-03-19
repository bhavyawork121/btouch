import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { clearAllCaches } from "@/lib/dbCache";
import { connectDB } from "@/lib/mongodb";
import { CardConfig } from "@/lib/models/CardConfig";
import { User } from "@/lib/models/User";

export async function POST() {
  await connectDB();
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).lean();
  const config = user ? await CardConfig.findOne({ userId: user._id }).lean() : null;

  if (!config) {
    return NextResponse.json({ error: "Card configuration not found" }, { status: 404 });
  }

  await clearAllCaches(config.username);

  return NextResponse.json({ ok: true, username: config.username });
}
