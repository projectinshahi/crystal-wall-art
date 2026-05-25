import { OrderedShipmentsTypes, ShipmentStatus } from "@/types/Admin/orders.types";

export type AdminOrderedShipmentsDTO = {
    id: string;
    order_id: string;
    shipment_number: string;
    courier: string;
    tracking_id: string;
    status: ShipmentStatus;
    notes: string;
    shipped_at: string;
    delivered_at: string;
    created_at: string;
    updated_at: string;
}

export function toAdminOrderedShipmentsDTO(
    row: OrderedShipmentsTypes
): AdminOrderedShipmentsDTO {
    return {
        id: row.id,
        order_id: row.order_id,
        shipment_number: row.shipment_number,
        courier: row.courier,
        tracking_id: row.tracking_id,
        status: row.status,
        notes: row.status,
        shipped_at: row.shipped_at,
        delivered_at: row.delivered_at,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}