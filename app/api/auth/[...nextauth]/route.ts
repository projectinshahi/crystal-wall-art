import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔐 ADMIN LOGIN
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/admin/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data.success) return null;

          return {
            id: data.user.id,
            email: data.user.email,

            role: {
              id: data.user.role?.id,
              name: data.user.role?.name as "admin" | "user",
            },

            profile: {
              fullName: data.user.profile?.fullName ?? null,
              avatarUrl: data.user.profile?.avatarUrl ?? null,
            },
          };
        } catch (err) {
          console.error("Admin login error:", err);
          return null;
        }
      },
    }),

    // 📱 CLIENT OTP LOGIN
    CredentialsProvider({
      id: "client-otp",
      name: "Client OTP",
      credentials: {
        mobile: { type: "text" },
        otp: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.mobile || !credentials?.otp) return null;

        const user = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/client/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobile: credentials.mobile,
              otp: credentials.otp,
            }),
          }
        ).then((r) => r.json());

        console.log("user",user);
        if (!user?.success) return null;

        return {
          id: user.data.id,
          email: user.data.email,
          role: {
            id: user.data.role_id,
            name: user.data.name,
          },
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🧠 JWT STORE
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profile = user.profile;
        token.provider = account?.provider;
      }
      return token;
    },

    // 📦 SESSION OUTPUT
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        profile: token.profile,
      };

      return session;
    }
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };