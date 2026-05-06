export const CategoryAdminQueries = {
  getAll: `
    SELECT
      id,
      title,
      description,
      image_url,
      priority,
      is_active,
      created_at,
      updated_at
    FROM categories
  `,

  create: `
    INSERT INTO categories (
      title,
      description,
      image_url,
      priority,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      title,
      description,
      image_url,
      priority,
      is_active,
      created_at,
      updated_at
  `,

  softDelete: `
    UPDATE categories
    SET
      deleted = TRUE,
      is_active = FALSE
    WHERE id = $1
    RETURNING
      id,
      title,
      description,
      image_url,
      priority,
      is_active,
      deleted,
      created_at,
      updated_at
  `,

  updateStatus: `
    UPDATE categories
    SET
      is_active = $1
    WHERE id = $2
    RETURNING
      id,
      title,
      description,
      image_url,
      priority,
      is_active,
      deleted,
      created_at,
      updated_at
  `,

  update: `
    UPDATE categories
    SET
      title = $1,
      description = $2,
      image_url = $3,
      priority = $4,
      is_active = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING
      id,
      title,
      description,
      image_url,
      priority,
      is_active,
      deleted,
      created_at,
      updated_at
  `,
};