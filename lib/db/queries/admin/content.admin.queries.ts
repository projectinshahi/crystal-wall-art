export const ContentAdminQueries = {
    getAll: `
        SELECT
          id,
          type,
          title,
          description,
          link_url,
          image,
          priority,
          deleted,
          is_active,
          created_at,
          updated_at
        FROM contents
    `,

    create: `
        INSERT INTO contents (
          type,
          title,
          description,
          link_url,
          image,
          priority
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          type,
          title,
          description,
          link_url,
          image,
          priority,
          deleted,
          is_active,
          created_at,
          updated_at
    `,

    softDelete: `
        UPDATE contents
        SET
          deleted = TRUE,
          is_active = FALSE
        WHERE id = $1
        RETURNING
          id,
          type,
          title,
          description,
          link_url,
          image,
          priority,
          deleted,
          is_active,
          created_at,
          updated_at
    `,

    updateStatus: `
        UPDATE contents
        SET
          is_active = $2
        WHERE id = $1
        RETURNING
          id,
          type,
          title,
          description,
          link_url,
          image,
          priority,
          deleted,
          is_active,
          created_at,
          updated_at
    `,

    update: `
        UPDATE contents
        SET
          type = $2,
          title = $3,
          description = $4,
          link_url = $5,
          image = $6,
          priority = $7
        WHERE id = $1
        RETURNING
          id,
          type,
          title,
          description,
          link_url,
          image,
          priority,
          deleted,
          is_active,
          created_at,
          updated_at
    `,
}