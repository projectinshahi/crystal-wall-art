import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { readQuery } from "@/lib/db";
import { validateEmail, validatePassword } from "@/lib/validation";

export const authOptions: NextAuthOptions = {
  providers: [
    // =========================================================
    // ADMIN LOGIN
    // =========================================================
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const cleanEmail = validateEmail(credentials.email);
          const cleanPass = validatePassword(credentials.password);

          const [user] = await readQuery<AuthUserRow>(
            `
  SELECT
    u.id,
    u.email,
    u.password_hash,
    u.status,

    json_build_object(
      'fullName', up.full_name,
      'avatarUrl', up.avatar_url
    ) AS profile,

    json_build_object(
      'id', r.id,
      'name', r.name
    ) AS role

  FROM public.auth_users u
  JOIN public.user_profiles up
    ON up.user_id = u.id
  JOIN public.roles r
    ON r.id = up.role_id

  WHERE u.email = $1
  LIMIT 1
  `,
            [cleanEmail]
          );

          // timing attack prevention
          const hash = user?.password_hash;

          const passwordValid = await bcrypt.compare(
            cleanPass,
            hash
          );

          if (
            !user ||
            !passwordValid ||
            user.status !== "active"
          ) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,

            role: {
              id: user.role?.id,
              name: user.role?.name,
            },

            profile: {
              fullName: user.profile?.fullName,
              avatarUrl: user.profile?.avatarUrl,
            },
          };
        } catch (err) {
          console.error("Admin login error:", err);
          return null;
        }
      },
    }),

    // =========================================================
    // CLIENT OTP LOGIN
    // =========================================================
    CredentialsProvider({
      id: "client-otp",
      name: "Client OTP",

      credentials: {
        mobile: { type: "text" },
        otp: { type: "text" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.mobile || !credentials?.otp) {
            return null;
          }

          const [user] = await readQuery<AuthUserRow>(
            `
            SELECT
              u.id,
              u.email,

              json_build_object(
                'fullName', up.full_name,
                'avatarUrl', up.avatar_url
              ) AS profile,

              json_build_object(
                'id', r.id,
                'name', r.name
              ) AS role

            FROM public.auth_users u
            JOIN public.user_profiles up
              ON up.user_id = u.id
            JOIN public.roles r
              ON r.id = up.role_id

            WHERE u.mobile = $1
              AND u.otp_code = $2
              AND u.status = 'active'
            LIMIT 1
            `,
            [
              credentials.mobile,
              credentials.otp,
            ]
          );

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,

            role: {
              id: user.role?.id,
              name: user.role?.name,
            },

            profile: {
              fullName: user.profile?.fullName,
              avatarUrl: user.profile?.avatarUrl,
            },
          };
        } catch (err) {
          console.error("OTP login error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.profile = user.profile;
        token.provider = account?.provider;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role,
        profile: token.profile,
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",

      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure:
          process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };