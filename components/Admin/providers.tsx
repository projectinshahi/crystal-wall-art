"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  basePath,
}: {
  children: React.ReactNode;
  // NextAuth API base path; the admin layout passes /api/admin/auth, the storefront uses the default /api/auth
  basePath?: string;
}) {
  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
}
