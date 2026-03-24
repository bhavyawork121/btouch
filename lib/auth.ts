import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

interface GitHubProfile {
  id: number | string;
  login?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const githubProfile = profile as GitHubProfile;
      const githubId = String(githubProfile.id);
      const login = (githubProfile.login ?? "").toLowerCase();

      const dbUser = await prisma.user.upsert({
        where: { githubId },
        update: {
          email: user.email ?? "",
          name: user.name ?? "",
          image: user.image ?? "",
          avatarUrl: user.image ?? "",
          username: login || githubId,
        },
        create: {
          githubId,
          email: user.email ?? "",
          name: user.name ?? "",
          image: user.image ?? "",
          avatarUrl: user.image ?? "",
          username: login || githubId,
        },
      });

      const existing = await prisma.cardConfig.findUnique({
        where: { userId: dbUser.id },
      });

      if (!existing) {
        await prisma.cardConfig.create({
          data: {
            userId: dbUser.id,
            username: dbUser.username,
            githubHandle: githubProfile.login ?? "",
            displayName: user.name ?? "",
            avatarUrl: user.image ?? "",
          },
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (token?.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { githubId: token.sub },
          include: { card: true },
        });

        if (dbUser && session.user) {
          const sessionUser = session.user as {
            id?: string;
            username?: string;
            cardUsername?: string | null;
          };
          sessionUser.id = dbUser.id;
          sessionUser.username = dbUser.username;
          sessionUser.cardUsername = dbUser.card?.username ?? null;
        }
      }

      return session;
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.sub = String((profile as GitHubProfile).id);
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
});
