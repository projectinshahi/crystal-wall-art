export const OrderedShipmentsAdminQueries = {
    getAllByOrderId: `
        SELECT
            id,
            order_id,
            shipment_number,
            courier,
            tracking_id,
            status,
            notes,
            shipped_at,
            delivered_at,
            created_at,
            updated_at
        FROM shipments
        WHERE order_id = $1
    `
}