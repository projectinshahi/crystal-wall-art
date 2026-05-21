export const UserOrderQueries = {
    getAllByUser: `
        SELECT
            id,
            order_number,
            status,
            total,
            created_at
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
    `,

    getOrderDetails: `
        SELECT
            id,
  order_number,
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  billing_address
  status,
  payment_status,
  subtotal,
  tax,
  shipping_cost,
  total,
  notes,
  payment_method,
  razorpay_order_id,
  razorpay_payment_id,
  created_at,
  updated_at
        FROM orders
        WHERE id = $1
    `,

    getAllItemsData: `
        SELECT
            id,
            product_title,
            product_image,
            quantity,
            unit_price,
            total_price
        FROM order_items
        WHERE order_id = $1
        ORDER BY created_at ASC
    `,

    getAllTimeLineData: `
        SELECT
            id,
            status,
            note,
            created_at
        FROM order_timeline
        WHERE order_id = $1
        ORDER BY created_at ASC
    `
}