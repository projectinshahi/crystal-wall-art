// /app/api/user/profile/route.ts
import { requireAuth } from "@/lib/session";

export async function GET() {
  const session = await requireAuth();

  return Response.json({
    id: session.user.id,
    role: session.user.role,
  });
}