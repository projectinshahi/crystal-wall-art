import { UserOrders } from "@/types/order.type";

export type UserOrderDTO = {
    id: string;
    order_number: string;
    status: 'confirmed' | 'pending';
    total: number;
    created_at: string;
}

export function toUserOrderDTO (row: UserOrders): UserOrderDTO {
    return {
        id: row.id,
        order_number: row.order_number,
        status: row.status,
        total: row.total,
        created_at: row.created_at
    }
}