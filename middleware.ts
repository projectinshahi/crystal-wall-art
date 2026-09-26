import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-cookies";

// Guards the admin panel only. Storefront routes are never redirected, so an admin
// session (admin cookie) and a customer session (storefront cookie) can coexist.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: ADMIN_SESSION_COOKIE,
  });

  const isAdmin = token?.role?.name === "admin";

  if (pathname === "/admin/login") {
    return isAdmin
      ? NextResponse.redirect(new URL("/admin", req.url))
      : NextResponse.next();
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
