export const OrderedItemsAdminQueries = {
    getAllByOrderId: `
        SELECT
            id,
            order_id,
            product_id,
            variant_id,
            product_title,
            product_image,
            size,
            thickness,
            mounting_method,
            orientation,
            quantity,
            unit_price,
            total_price,
            created_at,
            options
        FROM order_items
        WHERE order_id = $1
    `
}