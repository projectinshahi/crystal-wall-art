export const ProductAdminQueries = {
    getAll: `
        SELECT
            id,
            title,
            description,
            price,
            discount_price,
            stock_quantity,
            category_id,
            status,
            created_at,
            updated_at,
            sizes,
            thicknesses,
            mounting_methods,
            orientations,
            thumbnail
        FROM products
    `,

    create: `
        INSERT INTO products (
            title,
            description,
            price,
            discount_price,
            stock_quantity,
            category_id,
            status,
            sizes,
            thicknesses,
            mounting_methods,
            orientations,
            thumbnail
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12
        )
        RETURNING *
    `,

    updateStatus: `
        UPDATE products
        SET
            status = $1
        WHERE id = $2
        RETURNING
            id,
            title,
            description,
            price,
            discount_price,
            stock_quantity,
            category_id,
            status,
            created_at,
            updated_at,
            sizes,
            thicknesses,
            mounting_methods,
            orientations,
            thumbnail
    `
}