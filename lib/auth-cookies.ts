// Edge-safe auth constants (imported by middleware — keep free of Node-only imports).

const isProduction = process.env.NODE_ENV === "production";

// Admin NextAuth instance lives at /api/admin/auth and uses its own cookies,
// so an admin session and a customer session can coexist in one browser.
export const ADMIN_AUTH_BASE_PATH = "/api/admin/auth";

export const ADMIN_SESSION_COOKIE = isProduction
    ? "__Secure-crystal-admin.session-token"
    : "crystal-admin.session-token";

export const ADMIN_CSRF_COOKIE = isProduction
    ? "__Host-crystal-admin.csrf-token"
    : "crystal-admin.csrf-token";

export const ADMIN_CALLBACK_COOKIE = isProduction
    ? "__Secure-crystal-admin.callback-url"
    : "crystal-admin.callback-url";

// Customer (storefront) session cookie — unchanged from the original configuration.
export const CUSTOMER_SESSION_COOKIE = isProduction
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
