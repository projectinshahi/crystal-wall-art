export const ProductPublicQueries = {
    productsByCategoryId: `
        SELECT
            id,
            title,
            description,
            price,
            discount_price,
            category_id,
            sizes,
            thickness,
            mounting_methods,
            orientations,
            thumbnail
        FROM products
        WHERE category_id = $1 AND deleted = FALSE AND status = 'active'
    `,

    productById: `
        SELECT
            p.id,
            p.title,
            p.description,
            p.price,
            p.discount_price,
            p.category_id,
            p.sizes,
            p.thickness,
            p.mounting_methods,
            p.orientations,
            p.thumbnail,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', pi.id,
                        'image_url', (pi.image_url::json ->> 'url')
                    )
                ) FILTER (WHERE pi.id IS NOT NULL),
                '[]'
            ) AS images
        FROM products p
        LEFT JOIN product_images pi
            ON pi.product_id = p.id
        WHERE
            p.id = $1
            AND p.deleted = FALSE
            AND p.status = 'active'
        GROUP BY p.id LIMIT 100
    `,

    productVariants: `
        SELECT
            id,
            product_id,
            size,
            thickness,
            price,
            discount_price,
            orientation
        FROM product_variants
        WHERE product_id = $1
    `
}