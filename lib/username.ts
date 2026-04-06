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
    prisma.user.findUnique({ where: { username: candidate } }),
    prisma.cardConfig.findUnique({ where: { username: candidate } }),
  ]);

  return Boolean(user || card);
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
