import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// ✅ Helper to avoid repeating token.role.name everywhere
const isAdmin = (token: any) => token?.role?.name === "admin";
const isUser  = (token: any) => token?.role?.name === "user";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 🏠 ROOT HANDLING
    if (pathname === "/") {
      if (isAdmin(token)) return NextResponse.redirect(new URL("/admin", req.url));
      if (isUser(token))  return NextResponse.redirect(new URL("/profile", req.url));
      return NextResponse.next();
    }

    // =========================
    // 🔐 ADMIN ROUTES
    // =========================
    if (pathname.startsWith("/admin")) {
      if (pathname === "/admin/login") {
        if (isAdmin(token)) return NextResponse.redirect(new URL("/admin", req.url));
        return NextResponse.next();
      }

      if (!token || !isAdmin(token)) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // =========================
    // 👤 CLIENT ROUTES
    // =========================
    if (pathname.startsWith("/profile")) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      if (isAdmin(token)) return NextResponse.redirect(new URL("/admin", req.url));
    }

    // =========================
    // 🔑 CLIENT LOGIN
    // =========================
    if (pathname === "/login") {
      if (isUser(token))  return NextResponse.redirect(new URL("/profile", req.url));
      if (isAdmin(token)) return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: NEXTAUTH_SECRET,
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/profile/:path*", "/admin/:path*"],
};