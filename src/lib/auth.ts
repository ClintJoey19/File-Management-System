import NextAuth from "next-auth";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user, profile }) {
      if (token) {
        const user = await prisma.user.findUnique({
          where: {
            id: token?.sub,
          },
        });

        token.role = user?.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session) {
        session.user.id = token.sub as string;
        // session.user.role = token.role as string;
      }

      return session;
    },
  },
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET as string,
});

// declare module "next-auth" {
//   interface User {
//     firstname: string;
//     lastname: string;
//     role: string;
//   }

//   interface Session {
//     user: User & DefaultSession["user"];
//     expires: string;
//     error: string;
//   }
// }
