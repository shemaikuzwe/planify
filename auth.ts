import db from "@/lib/drizzle";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { seed } from "@/lib/drizzle/seed";
import { accounts, users } from "@/lib/drizzle/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [Google({
    clientId:process.env.AUTH_GOOGLE_ID,
    clientSecret:process.env.AUTH_GOOGLE_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
 GitHub({
    clientId:process.env.AUTH_GITHUB_ID,
    clientSecret:process.env.AUTH_GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
],
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      await seed(user.id);
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },
});
