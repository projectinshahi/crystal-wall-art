import { ok, withHandler } from "@/lib/api/handler";
import { updateAccountProfile } from "@/lib/db/repositories/user/account.user.repository";
import { NextResponse } from "next/server";

export const PATCH = withHandler(
    async ({ req, user }): Promise<NextResponse> => {
        try {
            const body = await req.json();

            const userId = user.id;

            if (!userId) {
                throw new Error("Unauthorized");
            }

            const updatedProfile =
                await updateAccountProfile(
                    userId,
                    body
                );

            if (!updatedProfile) {
                throw new Error(
                    "Failed to update profile"
                );
            }

            const response = ok({
                message:
                    "Profile updated successfully",
                // data: updatedProfile,
            });

            response.headers.set(
                "Cache-Control",
                "no-store"
            );

            return response;
        } catch (error) {
            console.error(
                "PATCH profile error:",
                error
            );

            throw error;
        }
    },
    { access: "user" }
);