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

  insertAuthUser: `
    INSERT INTO auth_users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, phone
  `,

  insertUserProfile: `
    INSERT INTO user_profiles (user_id, first_name, last_name, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING first_name, last_name
  `,
};