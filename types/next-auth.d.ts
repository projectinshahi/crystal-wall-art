// types/next-auth.d.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;

      role: {
        id: string;
        name: string;
      };

      profile: {
        fullName: string | null;
        avatarUrl: string | null;
      };

      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;

    role: {
      id: string;
      name: string;
    };

    profile: {
      fullName: string | null;
      avatarUrl: string | null;
    };

    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;

    role: {
      id: string;
      name: string;
    };

    profile: {
      fullName: string | null;
      avatarUrl: string | null;
    };

    email: string;

    provider?: string;
  }
}