import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "@/lib/mongodb";
import { CardConfig } from "@/lib/models/CardConfig";
import { User } from "@/lib/models/User";

interface GitHubProfile {
  id: number | string;
  login?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      await connectDB();

      const githubProfile = profile as GitHubProfile;
      const githubId = String(githubProfile.id);
      const username = githubProfile.login?.toLowerCase() ?? githubId;

      const existing = await User.findOneAndUpdate(
        { githubId },
        {
          githubId,
          email: user.email ?? "",
          name: user.name ?? "",
          avatarUrl: user.image ?? "",
          username,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const hasCard = await CardConfig.exists({ userId: existing._id });
      if (!hasCard) {
        await CardConfig.create({
          userId: existing._id,
          username,
          githubHandle: githubProfile.login ?? "",
          displayName: user.name ?? "",
          avatarUrl: user.image ?? "",
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (token?.sub) {
        await connectDB();
        const user = await User.findOne({ githubId: token.sub }).lean();
        if (user && session.user) {
          Object.assign(session.user, {
            id: user._id.toString(),
            username: user.username,
          });
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
