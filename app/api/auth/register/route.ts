import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { verifyPassword } from "@/lib/password";
import { createUniqueUsername } from "@/lib/username";
import { signupSchema } from "@/lib/auth-forms";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Signup details are invalid.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const requestedUsername = parsed.data.username?.toLowerCase().trim() || "";
  const displayName = parsed.data.name?.trim() || email.split("@")[0];

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    if (!existingUser.passwordHash) {
      return NextResponse.json({ error: "This account uses Google sign-in. Use Google to continue." }, { status: 409 });
    }

    const passwordOk = await verifyPassword(parsed.data.password, existingUser.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, username: existingUser.username, exists: true });
  }

  const existingUsername = requestedUsername
    ? await prisma.user.findUnique({ where: { username: requestedUsername } })
    : null;
  const existingCard = requestedUsername ? await prisma.cardConfig.findUnique({ where: { username: requestedUsername } }) : null;
  if (existingUsername || existingCard) {
    return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
  }

  const uniqueUsername = await createUniqueUsername([requestedUsername, displayName, email.split("@")[0]]);
  const passwordHash = await hashPassword(parsed.data.password);

  const user = await prisma.user.create({
    data: {
      email,
      name: displayName,
      image: "",
      avatarUrl: "",
      username: uniqueUsername,
      passwordHash,
    },
  });

  await prisma.cardConfig.create({
    data: {
      userId: user.id,
      username: uniqueUsername,
      displayName,
      avatarUrl: "",
      githubHandle: "",
    },
  });

  return NextResponse.json({ ok: true, username: uniqueUsername });
}
