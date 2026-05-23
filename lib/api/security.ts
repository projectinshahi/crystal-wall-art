import { NextRequest } from 'next/server';

const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ??
    process.env.NEXT_PUBLIC_URL ??
    ""
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

console.log("[CORS] Allowed origins:", allowedOrigins);

const ALLOWED_ORIGINS = new Set(allowedOrigins);

export function isAllowedOrigin(origin: string | null) {

    console.log("[CORS] Incoming origin:", origin);

    // Allow all in development
    if (process.env.NODE_ENV === "development") {

        console.log("[CORS] Development mode → allowed");

        return true;
    }

    // Block empty origin
    if (!origin) {

        console.log("[CORS] Blocked → missing origin");

        return false;
    }

    const isAllowed = ALLOWED_ORIGINS.has(origin);

    console.log(
        `[CORS] ${isAllowed ? "Allowed" : "Blocked"} origin:`,
        origin
    );

    return isAllowed;
}

export function getCorsHeaders(
  origin: string | null
): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods':
      'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-CSRF-Token',
    Vary: 'Origin',
  };
}

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self';",
  'Cache-Control': 'no-store',
};

export function getClientIp(req: NextRequest) {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}