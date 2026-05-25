export const OrdersAdminQueries = {
    getAll: `
        SELECT
            id,
            order_number,
            user_id,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            billing_address,
            status,
            payment_status,
            subtotal,
            tax,
            shipping_cost,
            total,
            notes,
            razorpay_order_id,
            razorpay_payment_id,
            created_at,
            updated_at,
            payment_method
        FROM orders
    `,

    getOrderById: `
        SELECT
            id,
            order_number,
            user_id,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            billing_address,
            status,
            payment_status,
            subtotal,
            tax,
            shipping_cost,
            total,
            notes,
            razorpay_order_id,
            razorpay_payment_id,
            created_at,
            updated_at,
            payment_method
        FROM orders
        WHERE id = $1
    `
}