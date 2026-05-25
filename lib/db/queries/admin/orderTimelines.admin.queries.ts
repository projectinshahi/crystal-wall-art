export const OrderTimelinesAdminQueries ={
    getAllByOrderId: `
        SELECT
            id,
            order_id,
            status,
            note,
            created_at
        FROM order_timeline
        WHERE order_id = $1
    `
}