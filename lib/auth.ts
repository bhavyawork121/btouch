import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createUniqueUsername } from "@/lib/username";
import { signupSchema } from "@/lib/auth-forms";

type SessionUserShape = {
  id?: string;
  username?: string;
  cardUsername?: string | null;
};

async function ensureCardForUser(userId: string, data?: { name?: string | null; image?: string | null }) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    include: { card: true },
  });

  if (!existing) {
    return null;
  }

  const username = existing.username || (await createUniqueUsername([existing.email, data?.name, existing.name]));
  const name = (data?.name ?? existing.name ?? existing.email.split("@")[0]).trim();
  const image = data?.image ?? existing.image ?? existing.avatarUrl ?? "";

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      image,
      avatarUrl: image,
      username,
    },
  });

  if (!existing.card) {
    await prisma.cardConfig.create({
      data: {
        userId: user.id,
        username,
        displayName: name,
        avatarUrl: image,
        githubHandle: "",
      },
    });
  } else if (existing.card.username !== username) {
    await prisma.cardConfig.update({
      where: { userId: user.id },
      data: { username },
    });
  }

  return user;
}

async function createOAuthUser(user: { email?: string | null; name?: string | null; image?: string | null }) {
  const email = user.email?.trim();
  if (!email) {
    throw new Error("OAuth account is missing an email address.");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { card: true },
  });

  const username = existing?.username || (await createUniqueUsername([email.split("@")[0], user.name]));
  const name = (user.name ?? email.split("@")[0]).trim();
  const image = user.image ?? "";

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        name,
        image,
        avatarUrl: image,
        username,
      },
    });

    if (!existing.card) {
      await prisma.cardConfig.create({
        data: {
          userId: updated.id,
          username,
          displayName: name,
          avatarUrl: image,
          githubHandle: "",
        },
      });
    } else if (existing.card.username !== username) {
      await prisma.cardConfig.update({
        where: { userId: updated.id },
        data: { username },
      });
    }

    return updated;
  }

  const created = await prisma.user.create({
    data: {
      email,
      name,
      image,
      avatarUrl: image,
      username,
      passwordHash: null,
    },
  });

  await prisma.cardConfig.create({
    data: {
      userId: created.id,
      username,
      displayName: name,
      avatarUrl: image,
      githubHandle: "",
    },
  });

  return created;
}

const baseAdapter = PrismaAdapter(prisma);
const adapter: Adapter = {
  ...baseAdapter,
  async createUser(user) {
    return createOAuthUser(user);
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth",
  },
  adapter,
  providers: [
    ...(process.env.AUTH_RESEND_KEY && process.env.AUTH_EMAIL_FROM
      ? [
          Resend({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: process.env.AUTH_EMAIL_FROM,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = signupSchema
          .pick({
            email: true,
            password: true,
          })
          .safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            avatarUrl: true,
            username: true,
            passwordHash: true,
            card: true,
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!passwordOk) {
          return null;
        }

        await ensureCardForUser(user.id, { name: user.name, image: user.image || user.avatarUrl || "" });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.id) {
        return false;
      }

      const dbUser = await ensureCardForUser(user.id, { name: user.name, image: user.image });
      if (!dbUser) {
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      if (token?.sub && session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { card: true },
        });

        if (dbUser) {
          const sessionUser = session.user as SessionUserShape;
          sessionUser.id = dbUser.id;
          sessionUser.username = dbUser.username;
          sessionUser.cardUsername = dbUser.card?.username ?? null;
        }
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
});
