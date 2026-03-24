"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { clearAllCaches } from "@/lib/dbCache";
import { prisma } from "@/lib/prisma";
import { cardConfigFormSchema } from "@/lib/validation";

export interface SaveCardConfigResult {
  ok: boolean;
  message: string;
}

export async function saveCardConfig(formData: FormData): Promise<SaveCardConfigResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { ok: false, message: "You need to sign in again before saving." };
  }

  const parsed = cardConfigFormSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl"),
    currentRole: formData.get("currentRole"),
    currentCompany: formData.get("currentCompany"),
    linkedinHandle: formData.get("linkedinHandle"),
    githubHandle: formData.get("githubHandle"),
    leetcodeHandle: formData.get("leetcodeHandle"),
    cfHandle: formData.get("cfHandle"),
    gfgHandle: formData.get("gfgHandle"),
    theme: formData.get("theme"),
    accentColor: formData.get("accentColor"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Card details are invalid. Review the form and try again." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { ok: false, message: "Unable to save user profile." };
  }

  const existingConfig = await prisma.cardConfig.findUnique({
    where: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: session.user.name ?? parsed.data.displayName,
      username: parsed.data.username.toLowerCase(),
      image: parsed.data.avatarUrl ?? "",
      avatarUrl: parsed.data.avatarUrl ?? "",
    },
  });

  await prisma.cardConfig.upsert({
    where: { userId: user.id },
    update: {
      username: parsed.data.username.toLowerCase(),
      linkedinUrl: parsed.data.linkedinHandle ? `https://www.linkedin.com/in/${parsed.data.linkedinHandle}` : "",
      displayName: parsed.data.displayName,
      headline: parsed.data.headline ?? "",
      bio: parsed.data.bio ?? "",
      avatarUrl: parsed.data.avatarUrl ?? "",
      currentRole: parsed.data.currentRole ?? "",
      currentCompany: parsed.data.currentCompany ?? "",
      githubHandle: parsed.data.githubHandle ?? "",
      leetcodeHandle: parsed.data.leetcodeHandle ?? "",
      cfHandle: parsed.data.cfHandle ?? "",
      gfgHandle: parsed.data.gfgHandle ?? "",
      theme: parsed.data.theme,
      accentColor: parsed.data.accentColor,
    },
    create: {
      userId: user.id,
      username: parsed.data.username.toLowerCase(),
      linkedinUrl: parsed.data.linkedinHandle ? `https://www.linkedin.com/in/${parsed.data.linkedinHandle}` : "",
      displayName: parsed.data.displayName,
      headline: parsed.data.headline ?? "",
      bio: parsed.data.bio ?? "",
      avatarUrl: parsed.data.avatarUrl ?? "",
      currentRole: parsed.data.currentRole ?? "",
      currentCompany: parsed.data.currentCompany ?? "",
      githubHandle: parsed.data.githubHandle ?? "",
      leetcodeHandle: parsed.data.leetcodeHandle ?? "",
      cfHandle: parsed.data.cfHandle ?? "",
      gfgHandle: parsed.data.gfgHandle ?? "",
      theme: parsed.data.theme,
      accentColor: parsed.data.accentColor,
    },
  });

  if (existingConfig?.username) {
    await clearAllCaches(existingConfig.username);
  }
  await clearAllCaches(parsed.data.username.toLowerCase());

  revalidatePath("/dashboard");
  revalidatePath(`/${parsed.data.username.toLowerCase()}`);

  if (existingConfig?.username && existingConfig.username !== parsed.data.username.toLowerCase()) {
    revalidatePath(`/${existingConfig.username}`);
  }

  return { ok: true, message: "Card saved." };
}
