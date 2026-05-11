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
    `
}