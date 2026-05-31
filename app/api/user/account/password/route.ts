import { err, ok, withHandler } from "@/lib/api/handler";
import { updateUserPassword, getAuthUserById } from "@/lib/db/repositories/user/account.user.repository";
import { validatePassword } from "@/lib/validation";
import { hashPassword } from "@/lib/hash";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const PATCH = withHandler(
    async ({ req, user }): Promise<NextResponse> => {
        try {
            const body = await req.json();
            const userId = user?.id;

            if (!userId) {
                throw new Error("Unauthorized");
            }

            const currentPassword = String(body.current_password || "");
            const newPassword = String(body.new_password || "");
            const confirmPassword = String(body.confirm_password || "");

            validatePassword(currentPassword);
            validatePassword(newPassword);

            if (newPassword !== confirmPassword) {
                throw new Error("New passwords do not match");
            }

            const authUser: any = await getAuthUserById(userId);
            if (!authUser?.password_hash) {
                throw new Error("Unable to validate current password");
            }

            const validPassword = await bcrypt.compare(currentPassword, authUser.password_hash);
            if (!validPassword) {
                throw new Error("Current password is incorrect");
            }

            const passwordHash = await hashPassword(newPassword);
            const updated = await updateUserPassword(userId, passwordHash);

            if (!updated) {
                throw new Error("Failed to update password");
            }

            const response = ok({ message: "Password updated successfully" });
            response.headers.set("Cache-Control", "no-store");
            return response;
        } catch (error) {
            console.error("PATCH password error:", error);
            return err(
                error instanceof Error ? error.message : "Failed to update password",
                400
            );
        }
    },
    { access: "user" }
);
