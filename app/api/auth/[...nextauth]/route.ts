// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.email = profile?.email;
        token.name = profile?.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user!.email = token.email;
      session.user!.name = token.name;
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Generate custom JWT
        const customJwt = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "1d" }
        );

        // Set custom JWT cookie
        (
          await // Set custom JWT cookie
          cookies()
        ).set("token", customJwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24,
          path: "/",
          sameSite: "lax",
        });
      }
      return true;
    },
  },
});
export { handler as GET, handler as POST };
