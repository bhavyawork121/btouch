import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { signupSchema } from "@/lib/auth-forms";

export const runtime = "nodejs";

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

  const mode =
    typeof payload === "object" &&
    payload !== null &&
    "mode" in payload &&
    (payload as { mode?: unknown }).mode === "login"
      ? "login"
      : "signup";

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { accounts: { select: { provider: true } } },
  });
  if (mode === "login") {
    if (!existingUser) {
      return NextResponse.json({ error: "No account exists for this email. Sign up first." }, { status: 404 });
    }

    if (!existingUser.passwordHash) {
      const providers = Array.from(new Set(existingUser.accounts.map((account) => account.provider))).sort();
      const providerLabel = providers.length > 0 ? providers.join(", ") : "passwordless or social sign-in";
      return NextResponse.json(
        { error: `This account uses ${providerLabel}. Use that sign-in method to continue.` },
        { status: 409 },
      );
    }

    const passwordOk = await verifyPassword(parsed.data.password, existingUser.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, username: existingUser.username, exists: true });
  }

  if (mode === "signup") {
    return NextResponse.json(
      { error: "Sign up with GitHub, Google, or a magic link. Email and password are login-only." },
      { status: 400 },
    );
  }

  return NextResponse.json({ error: "Email and password are login-only." }, { status: 400 });
}
