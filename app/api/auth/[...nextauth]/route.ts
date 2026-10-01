import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth-options";

// Customer (storefront) auth. Admin auth lives at /api/admin/auth.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
