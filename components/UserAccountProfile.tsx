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
import { Dialog, DialogContent } from "./ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import UserFormInput from "./Admin/inputs/FormInput/UserFormInputs";

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
  const [selectedDialog, setSelectedDialog] = useState<"edit" | "password" | null>(null);

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
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6 animate-fade-in">

          {/* Header */}
          <div className="w-full flex flex-end justify-end">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          {/* <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between">
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

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setSelectedDialog("password")}
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setSelectedDialog("edit")}
              >
                Edit Profile
              </Button>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div> */}

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border bg-card p-4 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  Profile details
                </p>
                <p className="text-base font-medium mt-2">
                  {session.user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.user.phone ?? "Phone not added"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Orders
                  </p>
                  <p className="text-xl font-semibold">{ordersList.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4 flex flex-col justify-center gap-3">
              <Typography variant="body" className="text-muted-foreground">
                Keep your account secure and update your details here.
              </Typography>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDialog("edit")}
              >
                Edit profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDialog("password")}
              >
                Change password
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
                  <Link
                    key={order.id}
                    href={`/order/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                      <Badge className={statusColor(order.status)} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={selectedDialog !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          {selectedDialog === "edit" ? (
            <EditProfileScreen
              user={session.user as AuthUserRow}
              onClose={() => setSelectedDialog(null)}
            />
          ) : selectedDialog === "password" ? (
            <ChangePasswordScreen
              onClose={() => setSelectedDialog(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default UserAccountProfile;

const profileSchema = z.object({
  user_name: z
    .string()
    .min(2, "User name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email"),

  phone: z
    .string()
    .min(10, "Please enter a valid phone number"),
});

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Current password is required"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

type ChangePasswordFormValues = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

type EditProfileFormValues = {
  user_name: string;
  email: string;
  phone: string;
};

const ChangePasswordScreen = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleSave = async (values: ChangePasswordFormValues) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/user/account/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to update password");
      }

      onClose();
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="w-full flex justify-center items-center h-14 px-4 bg-primary text-white shrink-0">
        <Typography className="font-bold" variant="body-lg">
          Change Password
        </Typography>
      </div>

      <div className="w-full space-y-5 flex-1 p-4">
        <UserFormInput
          name="current_password"
          control={control}
          type="password"
          label="Current Password"
          required
          error={errors.current_password?.message}
        />

        <UserFormInput
          name="new_password"
          control={control}
          type="password"
          label="New Password"
          required
          error={errors.new_password?.message}
        />

        <UserFormInput
          name="confirm_password"
          control={control}
          type="password"
          label="Confirm Password"
          required
          error={errors.confirm_password?.message}
        />

        <Button
          variant="default"
          className="w-full"
          disabled={loading}
          onClick={handleSubmit(handleSave)}
        >
          {loading ? "Saving..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
};

const EditProfileScreen = ({ user, onClose }: { user: AuthUserRow; onClose: () => void }) => {

  const { update } = useSession();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      user_name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        user_name: user?.profile?.user_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  }, [user, reset]);

  const handleSave = async (
    values: EditProfileFormValues
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/user/account/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update profile"
        );
      }

      await update({
        email: values.email,
        phone: values.phone,

        profile: {
          ...user.profile,
          user_name: values.user_name,
        },
      });


      onClose()
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="w-full flex justify-center items-center h-14 px-4 bg-primary text-white shrink-0">
        <Typography
          className="font-bold"
          variant="body-lg"
        >
          Edit Profile
        </Typography>
      </div>

      <div className="w-full space-y-5 flex-1 p-4">
        <UserFormInput
          name="user_name"
          control={control}
          label="User Name"
          required
          error={errors.user_name?.message}
        />

        <UserFormInput
          name="email"
          control={control}
          label="Email Address"
          required
          error={errors.email?.message}
          inputDisabled
        />

        <UserFormInput
          name="phone"
          control={control}
          label="Phone"
          required
          error={errors.phone?.message}
        />

        <Button
          variant="default"
          className="w-full"
          disabled={loading}
          onClick={handleSubmit(handleSave)}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}