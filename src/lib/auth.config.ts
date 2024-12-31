import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must have at least 8 characters" }),
});

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = loginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) return null;

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          );

          if (isPasswordMatched) {
            return {
              ...user,
              image: user.image,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
};
