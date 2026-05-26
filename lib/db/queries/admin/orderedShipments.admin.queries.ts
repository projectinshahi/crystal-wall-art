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
    `,

    createShipment: `
        INSERT INTO shipments (
            order_id,
            shipment_number,
            courier,
            tracking_id,
            status
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
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
    `,
    deleteShipment: `
        DELETE FROM shipments
        WHERE id = $1
        RETURNING
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
    `,
    updateShipment: `
        UPDATE shipments
        SET
            courier = COALESCE($2, courier),
            tracking_id = COALESCE($3, tracking_id),
            status = COALESCE($4, status),
            notes = COALESCE($5, notes),
            shipped_at = COALESCE($6, shipped_at),
            delivered_at = COALESCE($7, delivered_at),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
    `
}