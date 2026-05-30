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
        WHERE id = $1 AND deleted = FALSE AND status = 'active'
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