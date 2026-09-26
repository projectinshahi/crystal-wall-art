import NextAuth from "next-auth";

import { adminAuthOptions } from "@/lib/auth-options";

// Admin auth — separate NextAuth instance with its own cookies (see lib/auth-cookies.ts).
const handler = NextAuth(adminAuthOptions);

export { handler as GET, handler as POST };
