export const CategoryPublicQueries = {
    getAll: `
        SELECT
          id,
          title,
          description,
          image_url,
          priority,
          parent_id
        FROM categories
    `,

    categoryById: `
        SELECT
          id,
          title,
          description,
          image_url,
          priority,
          parent_id
        FROM categories
        WHERE id = $1 AND deleted = FALSE AND is_active = TRUE
    `
}