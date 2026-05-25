import { OrderedShipmentItemsTypes } from "@/types/Admin/orders.types";

export type AdminOrderedShipmentItemsDTO = {
    id: string;
    shipment_id: string;
    order_item_id: string;
    quantity: string;
    created_at: string;
}

export function toAdminOrderedShipmentItemsDTO(
    row: OrderedShipmentItemsTypes
): AdminOrderedShipmentItemsDTO {
    return {
        id: row.id,
        shipment_id: row.shipment_id,
        order_item_id: row.order_item_id,
        quantity: row.quantity,
        created_at: row.created_at
    };
}