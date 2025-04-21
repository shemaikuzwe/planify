import db from "@/lib/drizzle";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { seed } from "@/lib/drizzle/seed";
import { accounts, users } from "@/lib/drizzle/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [Google],
  events: {
    async createUser({ user }) {
       if(!user.id) return;
      await seed(user.id);
    },
  },
  session: {
    strategy: "jwt",
  },
});
