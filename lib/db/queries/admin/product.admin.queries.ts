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
            thickness,
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
            thickness,
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

    getById: `
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            p.discount_price,
            p.stock_quantity,
            p.category_id,
            p.status,
            p.created_at,
            p.updated_at,
            p.sizes,
            p.thickness,
            p.mounting_methods,
            p.orientations,
            p.thumbnail,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', pi.id,
                            'image_url', pi.image_url
                        )
                    )
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                ),
                '[]'
            ) AS images,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', pv.id,
                            'product_id', pv.product_id,
                            'size', pv.size,
                            'thickness', pv.thickness,
                            'price', pv.price,
                            'discount_price', pv.discount_price,
                            'orientation', pv.orientation,
                            'stock_quantity', pv.stock_quantity
                        )
                    )
                    FROM product_variants pv
                    WHERE pv.product_id = p.id
                ),
                '[]'
            ) AS variants,
            c.title AS category_title
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.id = $1
            AND p.deleted = FALSE
        LIMIT 1
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
            thickness,
            mounting_methods,
            orientations,
            thumbnail
    `
}