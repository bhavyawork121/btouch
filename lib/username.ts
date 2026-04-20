import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 39);
}

async function usernameExists(candidate: string) {
  const [user, card] = await Promise.all([
    prisma.$queryRaw<Array<{ username: string }>>(Prisma.sql`
      SELECT "username"
      FROM "User"
      WHERE "username" = ${candidate}
      LIMIT 1
    `),
    prisma.$queryRaw<Array<{ username: string }>>(Prisma.sql`
      SELECT "username"
      FROM "CardConfig"
      WHERE "username" = ${candidate}
      LIMIT 1
    `),
  ]);

  return user.length > 0 || card.length > 0;
}

export async function createUniqueUsername(inputs: Array<string | null | undefined>) {
  const base =
    inputs
      .map((value) => slugify(value ?? ""))
      .find((value) => value.length > 0) || "creator";

  let candidate = base;
  let suffix = 1;

  while (await usernameExists(candidate)) {
    const suffixText = `-${suffix}`;
    candidate = `${base.slice(0, Math.max(0, 39 - suffixText.length))}${suffixText}`;
    suffix += 1;
  }

  return candidate;
}
