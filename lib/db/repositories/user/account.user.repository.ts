import { readQuery, writeQuery } from "@/lib/db";
import { AccountQueries } from "../../queries/user/account.user.queries";

export type UpdateAccountProfilePayload = {
    user_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    metadata?: Record<string, any>;
};

export async function updateAccountProfile(
    userId: string,
    payload: UpdateAccountProfilePayload
) {
    // Update auth_users table
    await writeQuery(
        AccountQueries.updateUser,
        [
            userId,
            payload.email ?? null,
            payload.phone ?? null,
        ]
    );

    // Update profiles table
    await writeQuery(
        AccountQueries.updateProfile,
        [
            userId,
            payload.user_name ?? null,
            payload.avatar_url ?? null,
            payload.metadata ?? null,
        ]
    );

    // Fetch updated user
    const rows = await readQuery(
        AccountQueries.getUserById,
        [userId]
    );

    return rows?.[0] ?? null;
}

export async function getAuthUserById(userId: string) {
    const rows = await readQuery(
        AccountQueries.getAuthUserById,
        [userId]
    );

    return rows?.[0] ?? null;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
    const rows = await writeQuery(
        AccountQueries.updatePassword,
        [userId, passwordHash]
    );

    return rows?.[0] ?? null;
}
