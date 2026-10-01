import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { readQuery } from "@/lib/db";
import { validateEmail, validatePassword } from "@/lib/validation";
import { AuthUserRow } from "@/types/AuthUserRow.types";
import {
  ADMIN_CALLBACK_COOKIE,
  ADMIN_CSRF_COOKIE,
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
} from "@/lib/auth-cookies";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: isProduction,
};

// Shared email/password check. `requireRole` restricts who may sign in through a provider.
async function authorizeCredentials(
  credentials: Record<"email" | "password", string> | undefined,
  requireRole?: string
): Promise<User | null> {
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
    u.phone,
    u.password_hash,
    u.is_active,

    json_build_object(
      'user_name', up.user_name,
      'avatarUrl', up.avatar_url,
      'first_name', up.first_name,
      'last_name', up.last_name
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
      user.is_active !== true ||
      (requireRole && user.role?.name !== requireRole)
    ) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,

      role: {
        id: user.role?.id,
        name: user.role?.name,
      },

      profile: {
        user_name: user.profile?.user_name,
        avatarUrl: user.profile?.avatarUrl,
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
}

const callbacks: NextAuthOptions["callbacks"] = {
  async jwt({ token, user, account, trigger, session }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.phone = user.phone;
      token.role = user.role;
      token.profile = user.profile;
      token.provider = account?.provider;
    }

    // Client-driven session updates may change profile fields only — never the role.
    if (
      trigger === "update" &&
      session
    ) {
      if (session.email) {
        token.email = session.email;
      }

      if (session.phone) {
        token.phone = session.phone;
      }

      if (session.profile) {
        token.profile = {
          ...token.profile,
          ...session.profile,
        };
      }
    }

    return token;
  },

  async session({ session, token }) {
    session.user = {
      id: token.id as string,
      email: token.email as string,
      phone: token.phone as string,
      role: token.role,
      profile: token.profile,
    };

    return session;
  },
};

const credentialFields = {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
};

// =========================================================
// CUSTOMER (storefront) — /api/auth, cookie next-auth.session-token
// =========================================================
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "client-login",
      name: "Client Login",
      credentials: credentialFields,
      authorize: (credentials) => authorizeCredentials(credentials),
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks,

  pages: {
    signIn: "/auth/login",
  },

  cookies: {
    sessionToken: {
      name: CUSTOMER_SESSION_COOKIE,
      options: cookieOptions,
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// =========================================================
// ADMIN — /api/admin/auth, separate cookies, admin role only
// =========================================================
export const adminAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: credentialFields,
      authorize: (credentials) => authorizeCredentials(credentials, "admin"),
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks,

  pages: {
    signIn: "/admin/login",
  },

  cookies: {
    sessionToken: {
      name: ADMIN_SESSION_COOKIE,
      options: cookieOptions,
    },
    csrfToken: {
      name: ADMIN_CSRF_COOKIE,
      options: cookieOptions,
    },
    callbackUrl: {
      name: ADMIN_CALLBACK_COOKIE,
      options: { sameSite: "lax", path: "/", secure: isProduction },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
