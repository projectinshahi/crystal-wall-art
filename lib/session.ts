import { getServerSession } from "next-auth";
import { adminAuthOptions, authOptions } from "@/lib/auth-options";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(adminAuthOptions);
  if (!session) throw new Error("Unauthorized");
  if (session.user.role.name !== "admin") throw new Error("Forbidden");
  return session;
}
