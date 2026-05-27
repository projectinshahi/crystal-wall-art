export const OrderPublicQueries = {
    getOrderStatus: `
        WITH order_data AS (
            SELECT
                o.id,
                o.order_number,
                o.customer_name,
                o.status,
                o.payment_status,
                o.total,
                o.created_at
            FROM orders o
            WHERE o.order_number = $1
            LIMIT 1
        )

        SELECT
            od.id,
            od.order_number,
            od.customer_name,
            od.status,
            od.payment_status,
            od.total,
            od.created_at,

            COALESCE(
                json_agg(
                    json_build_object(
                        'product_title', oi.product_title,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items

        FROM order_data od

        LEFT JOIN order_items oi
            ON oi.order_id = od.id

        GROUP BY
            od.id,
            od.order_number,
            od.customer_name,
            od.status,
            od.payment_status,
            od.total,
            od.created_at;
    `
}