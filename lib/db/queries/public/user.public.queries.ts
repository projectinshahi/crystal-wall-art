export const UserPublicQueries = {
  userByEmail: `
    SELECT
      au.id,
      au.email,
      au.phone,
      up.first_name,
      up.last_name,
      up.user_name,
      up.avatar_url
    FROM auth_users au
    LEFT JOIN user_profiles up ON up.user_id = au.id
    WHERE au.email = $1
  `,

  userByPhone: `
        SELECT
            au.id,
            au.phone,
            au.firebase_uid,
            au.created_at,
            up.first_name,
            up.last_name,
            up.role_id
        FROM auth_users au
        JOIN user_profiles up ON up.user_id = au.id
        WHERE au.phone = $1
        LIMIT 1
    `,

  insertAuthUser: `
        INSERT INTO auth_users (phone, firebase_uid)
        VALUES ($1, $2)
        RETURNING id, phone, firebase_uid, created_at
    `,

  insertUserProfile: `
        INSERT INTO user_profiles (user_id, first_name, last_name, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING first_name, last_name
    `,
};