import { AuthUserRow } from "@/types/AuthUserRow.types";

export type PublicUserDTO = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string;
    user_name: string | null;
    avatarUrl: string | null;
};

export function toPublicUserDTO(row: AuthUserRow): PublicUserDTO {
    return {
        id: row.id,
        first_name: row.profile?.first_name ?? null,
        last_name: row.profile?.last_name ?? null,
        email: row.email,
        phone: row.phone,
        user_name: row.profile?.user_name ?? null,
        avatarUrl: row.profile?.avatarUrl ?? null,
    };
}