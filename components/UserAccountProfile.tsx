"use client";

import { LogOut, Package, User } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Typography } from "./ui/Typography";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthUserRow } from "@/types/AuthUserRow.types";

export function getDisplayName(user: AuthUserRow | any): string {
  // 1. Full name from session (NextAuth default)
  if (user?.name) return user.name;

  // 2. First + last name from profile
  const first = user?.profile?.first_name;
  const last = user?.profile?.last_name;

  if (first || last) {
    return [first, last].filter(Boolean).join(" ");
  }

  // 3. Email fallback
  if (user?.email) return user.email;

  // 4. fallback
  return "User";
}

const UserAccountProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. Handle loading state
  if (status === "loading") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading account...
      </div>
    );
  }

  // 2. Client-side redirect
  if (!session) {
    router.push("/auth/login");
    return null;
  }
  
  const orders: any[] = [];

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <User className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="text-xl font-bold">My Account</h1>
              <p className="text-sm text-muted-foreground">
                {getDisplayName(session.user)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border bg-card p-4 sm:p-6">
          <Typography
            variant="body-lg"
            className="font-semibold mb-4 flex items-center gap-2"
          >
            <Package className="h-5 w-5" /> My Orders
          </Typography>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <Typography
                variant="body-sm"
                className="text-muted-foreground"
              >
                No orders yet. Start shopping!
              </Typography>

              <Link href="/">
                <Button className="mt-3 text-white" size="sm">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Future: map orders here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountProfile;