import { prisma } from "@/lib/prisma";

const identityQuotes = [
  "Identity is not a profile picture. It is the work that keeps compounding when nobody is watching.",
  "A strong developer identity is built from proof, not adjectives.",
  "Your public presence should read like a living changelog of your curiosity.",
  "Credibility grows when the internet can verify what you say you build.",
  "A good portfolio shows taste. A great one also shows momentum.",
  "The cleanest signal is consistent work shipped over time.",
  "People remember developers whose work leaves a trail they can follow.",
];

export type HomeDirectoryUser = {
  username: string;
  displayName: string;
  headline: string;
  tagline: string;
  location: string;
  skills: string[];
  avatarUrl: string;
  updatedAt: Date;
};

export async function getHomepageUsers(): Promise<HomeDirectoryUser[]> {
  const users = await prisma.cardConfig.findMany({
    where: {
      isOnboarded: true,
      username: {
        not: "",
      },
    },
    select: {
      username: true,
      displayName: true,
      headline: true,
      tagline: true,
      location: true,
      skills: true,
      avatarUrl: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          avatarUrl: true,
          image: true,
        },
      },
    },
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return users.map((user) => ({
    username: user.username,
    displayName: user.displayName.trim() || user.user.name.trim() || user.username,
    headline: user.headline.trim(),
    tagline: user.tagline.trim(),
    location: user.location.trim(),
    skills: user.skills.filter(Boolean).slice(0, 3),
    avatarUrl: user.avatarUrl.trim() || user.user.avatarUrl.trim() || user.user.image?.trim() || "",
    updatedAt: user.updatedAt,
  }));
}

export function getIdentityQuoteOfDay(date = new Date()) {
  const dayNumber = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  const index = ((dayNumber % identityQuotes.length) + identityQuotes.length) % identityQuotes.length;

  return {
    quote: identityQuotes[index],
    dateLabel: date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}
