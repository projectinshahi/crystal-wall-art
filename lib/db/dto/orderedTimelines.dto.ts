import { OrderTimelinesTypes } from "@/types/Admin/orders.types";

export type AdminOrderTimelinesDTO = {
    id: string;
    order_id: string;
    status: string;
    note: string;
    created_at: string;
}

export function toAdminOrderTimelinesDTO(
    row: OrderTimelinesTypes
): AdminOrderTimelinesDTO {
    return {
        id: row.id,
        order_id: row.order_id,
        status: row.status,
        note: row.note,
        created_at: row.created_at
    };
}