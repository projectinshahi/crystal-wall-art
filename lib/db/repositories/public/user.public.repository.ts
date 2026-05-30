import { readQuery, writeQuery } from "@/lib/db";
import { PublicUserDTO, toPublicUserDTO } from "../../dto/user.dto";
import { AuthUserRow } from "@/types/AuthUserRow.types";
import { UserPublicQueries } from "../../queries/public/user.public.queries";

export const getUserByEmail = async (email: string): Promise<PublicUserDTO[]> => {
    const rows = await readQuery<AuthUserRow>(UserPublicQueries.userByEmail, [email]);
    return rows.map(toPublicUserDTO);
};

export const getUserByPhone = async (phone: string): Promise<PublicUserDTO[]> => {
    const rows = await readQuery<AuthUserRow>(UserPublicQueries.userByPhone, [phone]);
    return rows.map(toPublicUserDTO);
};

export const createUser = async ({
    first_name,
    last_name,
    phone,
    firebase_uid,
}: {
    first_name: string;
    last_name: string;
    phone: string;
    firebase_uid: string;
}): Promise<PublicUserDTO> => {

    // 1. Insert auth user (phone + firebase_uid — no password)
    const authRows = await writeQuery<any>(
        UserPublicQueries.insertAuthUser,
        [phone, firebase_uid]
    );
    const authUser = authRows[0];

    // 2. Insert profile
    await writeQuery(
        UserPublicQueries.insertUserProfile,
        [
            authUser.id,
            first_name,
            last_name,
            "d45bfdd1-7607-40d8-9146-84596828ab2c", // default role
        ]
    );

    // 3. Fetch full user (joined)
    const userRows = await readQuery<AuthUserRow>(
        UserPublicQueries.userByPhone,
        [phone]
    );

    return toPublicUserDTO(userRows[0]);
};