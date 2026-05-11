"use client";

import { LogOut, Package, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Typography } from "./ui/Typography";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthUserRow } from "@/types/AuthUserRow.types";
import { UserOrders } from "@/types/order.type";
import { Badge } from "./ui/badge";

export function getDisplayName(user: AuthUserRow | any): string {
  if (user?.name) return user.name;

  const first = user?.profile?.first_name;
  const last = user?.profile?.last_name;

  if (first || last) {
    return [first, last].filter(Boolean).join(" ");
  }

  if (user?.email) return user.email;

  return "User";
}

const UserAccountProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ordersList, setOrdersList] = useState<UserOrders[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Load orders after session exists
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);

        const res = await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }

        const result = await res.json();

        setOrdersList(result?.data ?? []);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrdersList([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [status]);

  // Loading session
  if (status === "loading") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading account...
      </div>
    );
  }

  // Prevent render before redirect
  if (!session) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/30";
      case "processing":
        return "bg-primary/10 text-primary border-primary/30";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
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
            <Package className="h-5 w-5" />
            My Orders
          </Typography>

          {loadingOrders ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading orders...
            </div>
          ) : ordersList.length === 0 ? (
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
              {ordersList.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4"
                >
                  <p className="font-medium">
                    Order #{order.order_number}
                  </p>

                  <Badge className={`text-sm w-fit ${statusColor(order.status)} `} variant={"outline"}>
                    Status: {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountProfile;