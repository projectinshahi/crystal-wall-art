export const ProductAdminQueries = {
    getAll: `
        SELECT
            *
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
    `
}