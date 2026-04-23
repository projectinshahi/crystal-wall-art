import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: {
      id: string;
      name: "admin" | "user";
    };
    profile?: {
      fullName: string | null;
      avatarUrl: string | null;
    } | null;
  }

  interface Session {
    user: {
      id: string;
      role: {
        id: string;
        name: "admin" | "user";
      };
      profile?: {
        fullName: string | null;
        avatarUrl: string | null;
      } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: {
      id: string;
      name: "admin" | "user";
    };
    profile?: {
      fullName: string | null;
      avatarUrl: string | null;
    } | null;
    provider?: string;
  }
}