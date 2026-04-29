import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { UserConfig, WorkEntry } from "@/types/stats";

const experienceSchema = z.array(
  z.object({
    role: z.string().optional().default(""),
    company: z.string().optional().default(""),
    period: z.string().optional().default(""),
    initial: z.string().optional().default(""),
  }),
);

const payloadSchema = z.object({
  username: z.string().trim().min(2).max(39).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(80),
  initials: z.string().trim().max(4).optional().default(""),
  tagline: z.string().trim().max(80).optional().default(""),
  bio: z.string().trim().max(240).optional().default(""),
  avatarUrl: z.string().trim().max(250000).optional().default(""),
  linkedinUrl: z.string().trim().max(200).optional().default(""),
  linkedinVerified: z.boolean().optional().default(false),
  portfolioUrl: z.string().trim().max(200).optional().default(""),
  github: z.string().trim().max(80).optional().default(""),
  leetcode: z.string().trim().max(80).optional().default(""),
  codeforces: z.string().trim().max(80).optional().default(""),
  gfg: z.string().trim().max(80).optional().default(""),
  skills: z.array(z.string().trim().min(1).max(24)).max(8).default([]),
  experience: experienceSchema.default([]),
  funZoneType: z.enum(["emoji", "quote", "custom"]).default("emoji"),
  funZoneValue: z.string().trim().max(60).optional().default("🚀"),
});

export type DashboardPayload = z.infer<typeof payloadSchema>;

function safeString(value: string | null | undefined, fallback = "") {
  return value?.trim() || fallback;
}

function buildInitials(name: string, fallback = "BT") {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || fallback;
}

function normalizeExperience(value: unknown): WorkEntry[] {
  const parsed = experienceSchema.safeParse(value);
  if (!parsed.success) {
    return [];
  }

  return parsed.data
    .map((item) => ({
      role: safeString(item.role),
      company: safeString(item.company),
      period: safeString(item.period),
      initial: safeString(item.initial) || buildInitials(item.company || item.role, "•"),
    }))
    .filter((item) => item.role || item.company || item.period);
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export function getPublicUrl(username: string) {
  return `${getBaseUrl().replace(/\/$/, "")}/${username}`;
}

function mapUserConfig(record: {
  username: string;
  displayName: string;
  initials: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  linkedinVerified: boolean;
  portfolioUrl: string;
  skills: string[];
  experience: unknown;
  funZoneType: string;
  funZoneValue: string;
  githubHandle: string;
  leetcodeHandle: string;
  cfHandle: string;
  gfgHandle: string;
  user: { name: string; avatarUrl: string; image: string | null };
}): UserConfig {
  const name = safeString(record.displayName, record.user.name);
  const experience = normalizeExperience(record.experience);
  const funZoneType = record.funZoneType === "quote" || record.funZoneType === "custom" ? record.funZoneType : "emoji";

  return {
    username: record.username,
    name,
    initials: safeString(record.initials, buildInitials(name)),
    tagline: safeString(record.tagline),
    bio: safeString(record.bio),
    avatarUrl: safeString(record.avatarUrl, record.user.avatarUrl || record.user.image || ""),
    linkedinUrl: safeString(record.linkedinUrl),
    linkedinVerified: record.linkedinVerified,
    portfolioUrl: safeString(record.portfolioUrl),
    skills: (record.skills || []).filter(Boolean).slice(0, 8),
    experience,
    funZone: {
      type: funZoneType,
      value: safeString(record.funZoneValue, "🚀"),
    },
    handles: {
      github: safeString(record.githubHandle),
      leetcode: safeString(record.leetcodeHandle),
      codeforces: safeString(record.cfHandle),
      gfg: safeString(record.gfgHandle),
    },
  };
}

export async function getUserConfig(username: string) {
  const card = await prisma.cardConfig.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true,
          image: true,
        },
      },
    },
  });

  if (!card) {
    return null;
  }

  return mapUserConfig(card);
}

export async function getDashboardConfig(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { card: { include: { user: true } } },
  });

  if (!user) {
    return null;
  }

  if (!user.card) {
    const created = await prisma.cardConfig.create({
      data: {
        userId: user.id,
        username: user.username,
        displayName: user.name,
        avatarUrl: user.avatarUrl || user.image || "",
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            image: true,
          },
        },
      },
    });

    return mapUserConfig(created);
  }

  return mapUserConfig(user.card as typeof user.card & { user: { name: string; avatarUrl: string; image: string | null } });
}

export async function saveDashboardConfig(userId: string, rawPayload: unknown) {
  const parsed = payloadSchema.parse(rawPayload);
  const username = parsed.username.toLowerCase();

  await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      name: parsed.name,
      avatarUrl: parsed.avatarUrl || undefined,
      image: parsed.avatarUrl || undefined,
    },
  });

  await prisma.cardConfig.upsert({
    where: { userId },
    update: {
      username,
      displayName: parsed.name,
      initials: parsed.initials || buildInitials(parsed.name),
      tagline: parsed.tagline,
      bio: parsed.bio,
      avatarUrl: parsed.avatarUrl,
      linkedinUrl: parsed.linkedinUrl,
      linkedinVerified: parsed.linkedinVerified,
      portfolioUrl: parsed.portfolioUrl,
      githubHandle: parsed.github,
      leetcodeHandle: parsed.leetcode,
      cfHandle: parsed.codeforces,
      gfgHandle: parsed.gfg,
      skills: parsed.skills.slice(0, 8),
      experience: parsed.experience,
      funZoneType: parsed.funZoneType,
      funZoneValue: parsed.funZoneValue || "🚀",
      currentRole: parsed.experience[0]?.role || "",
      currentCompany: parsed.experience[0]?.company || "",
    },
    create: {
      userId,
      username,
      displayName: parsed.name,
      initials: parsed.initials || buildInitials(parsed.name),
      tagline: parsed.tagline,
      bio: parsed.bio,
      avatarUrl: parsed.avatarUrl,
      linkedinUrl: parsed.linkedinUrl,
      linkedinVerified: parsed.linkedinVerified,
      portfolioUrl: parsed.portfolioUrl,
      githubHandle: parsed.github,
      leetcodeHandle: parsed.leetcode,
      cfHandle: parsed.codeforces,
      gfgHandle: parsed.gfg,
      skills: parsed.skills.slice(0, 8),
      experience: parsed.experience,
      funZoneType: parsed.funZoneType,
      funZoneValue: parsed.funZoneValue || "🚀",
      currentRole: parsed.experience[0]?.role || "",
      currentCompany: parsed.experience[0]?.company || "",
    },
  });

  return parsed;
}
