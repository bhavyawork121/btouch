import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const createCardSchema = z.object({
  name: z.string().trim().min(1).max(80),
  headline: z.string().trim().max(120).optional().default(""),
  bio: z.string().trim().max(500).optional().default(""),
  currentRole: z.string().trim().max(80).optional().default(""),
  currentCompany: z.string().trim().max(80).optional().default(""),
  linkedinUrl: z.string().trim().optional().default(""),
  github: z.string().trim().max(80).optional().default(""),
  leetcode: z.string().trim().max(80).optional().default(""),
  codeforces: z.string().trim().max(80).optional().default(""),
  gfg: z.string().trim().max(80).optional().default(""),
  theme: z.enum(["dark", "light", "auto"]).optional().default("dark"),
  accentColor: z.string().trim().optional().default("indigo"),
  avatarDataUrl: z.string().optional().nullable(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 39);
}

function normalizeLinkedInUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

async function getUniqueUsername(baseName: string) {
  const base = slugify(baseName) || "creator";
  let candidate = base;
  let suffix = 1;

  while ((await prisma.user.findUnique({ where: { username: candidate } })) || (await prisma.cardConfig.findUnique({ where: { username: candidate } }))) {
    const suffixText = `-${suffix}`;
    candidate = `${base.slice(0, Math.max(0, 39 - suffixText.length))}${suffixText}`;
    suffix += 1;
  }

  return candidate;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = createCardSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Card details are invalid.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const username = await getUniqueUsername(parsed.data.name);

  const user = await prisma.user.create({
    data: {
      githubId: `guest-${username}`,
      email: `${username}@btouch.local`,
      name: parsed.data.name,
      image: parsed.data.avatarDataUrl ?? "",
      avatarUrl: parsed.data.avatarDataUrl ?? "",
      username,
    },
  });

  await prisma.cardConfig.create({
    data: {
      userId: user.id,
      username,
      linkedinUrl: normalizeLinkedInUrl(parsed.data.linkedinUrl),
      displayName: parsed.data.name,
      headline: parsed.data.headline,
      bio: parsed.data.bio,
      avatarUrl: parsed.data.avatarDataUrl ?? "",
      currentRole: parsed.data.currentRole,
      currentCompany: parsed.data.currentCompany,
      githubHandle: parsed.data.github,
      leetcodeHandle: parsed.data.leetcode,
      cfHandle: parsed.data.codeforces,
      gfgHandle: parsed.data.gfg,
      theme: parsed.data.theme,
      accentColor: parsed.data.accentColor,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${username}`);

  return NextResponse.json({ ok: true, username });
}
