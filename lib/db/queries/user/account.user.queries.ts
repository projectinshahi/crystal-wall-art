export const AccountQueries = {
    updateUser: `
        UPDATE auth_users
        SET
            email = COALESCE($2, email),
            phone = COALESCE($3, phone)
        WHERE id = $1
        RETURNING
            id,
            email,
            phone,
            is_email_verified,
            is_phone_verified,
            created_at,
            updated_at
    `,

    updatePassword: `
        UPDATE auth_users
        SET password_hash = $2
        WHERE id = $1
        RETURNING id
    `,

    getAuthUserById: `
        SELECT id, password_hash
        FROM auth_users
        WHERE id = $1
        LIMIT 1
    `,

    updateProfile: `
        UPDATE user_profiles
        SET
            user_name = COALESCE($2, user_name),
            avatar_url = COALESCE($3, avatar_url),
            metadata = COALESCE($4, metadata)
        WHERE user_id = $1
        RETURNING
            user_id,
            user_name,
            avatar_url,
            role_id,
            metadata,
            created_at,
            updated_at
    `,

    getUserById: `
        SELECT
            au.id,
            au.email,
            au.phone,
            au.is_email_verified,
            au.is_phone_verified,
            au.last_login_at,
            au.created_at,
            au.updated_at,

            json_build_object(
                'id', r.id,
                'name', r.name
            ) AS role,

            json_build_object(
                'user_name', up.user_name,
                'avatar_url', up.avatar_url,
                'metadata', up.metadata
            ) AS profile

        FROM auth_users au

        LEFT JOIN user_profiles up
            ON up.user_id = au.id

        LEFT JOIN roles r
            ON r.id = up.role_id

        WHERE au.id = $1

        LIMIT 1
    `
};