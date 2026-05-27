// types/next-auth.d.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      phone?: string;

      role: {
        id: string;
        name: string;
      };

      profile: {
        user_name: string | null;
        avatarUrl: string | null;
      };

    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    phone?: string;

    role: {
      id: string;
      name: string;
    };

    profile: {
      user_name: string | null;
      avatarUrl: string | null;
    };

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    phone?: string;

    role: {
      id: string;
      name: string;
    };

    profile: {
      user_name: string | null;
      avatarUrl: string | null;
    };

    provider?: string;
  }
}