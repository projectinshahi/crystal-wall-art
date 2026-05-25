import { readQuery, writeQuery } from "@/lib/db";
import { PublicUserDTO, toPublicUserDTO } from "../../dto/user.dto";
import { AuthUserRow } from "@/types/AuthUserRow.types";
import { UserPublicQueries } from "../../queries/public/user.public.queries";

export const getUserByEmail = async (email: string): Promise<PublicUserDTO[]> => {
    const query = UserPublicQueries.userByEmail;

    const rows = await readQuery<AuthUserRow>(query, [email])

    return rows.map(
        toPublicUserDTO
    )
}

export const createUser = async ({
    first_name,
    last_name,
    email,
    password,
}: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}): Promise<PublicUserDTO> => {
console.log("Inserting");

// 1. Insert auth user
const authRows = await writeQuery<any>(UserPublicQueries.insertAuthUser,
    [email, password]
);
console.log("authRows",authRows);

    const authUser = authRows[0];

    // 2. Insert profile
    await writeQuery(UserPublicQueries.insertUserProfile,
        [
            authUser.id,
            first_name,
            last_name,
            "d45bfdd1-7607-40d8-9146-84596828ab2c", // default role
        ]
    );

    // 3. Fetch full user (joined)
    const userRows = await writeQuery<AuthUserRow>(UserPublicQueries.userByEmail,
        [email]
    );

    return toPublicUserDTO(userRows[0]);
};