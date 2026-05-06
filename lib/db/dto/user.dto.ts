import { AuthUserRow } from "@/types/AuthUserRow.types";

export type PublicUserDTO = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_name: string | null;
    avatarUrl: string | null;
};

export function toPublicUserDTO(row: AuthUserRow): PublicUserDTO {
    return {
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone,
        user_name: row.profile?.user_name ?? null,
        avatarUrl: row.profile?.avatarUrl ?? null,
    };
}