import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export type AdminRole = "admin" | "editor";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      role: AdminRole;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: AdminRole;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const result = await pool.query(
          "SELECT id, name, password_hash, role FROM admins WHERE username = $1",
          [username]
        );
        const admin = result.rows[0];
        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) return null;

        return { id: String(admin.id), name: admin.name, role: admin.role as AdminRole };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.name = user.name;
        token.role = (user as { role: AdminRole }).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.sub as string;
      session.user.name = token.name as string;
      session.user.role = token.role;
      return session;
    },
  },
});
