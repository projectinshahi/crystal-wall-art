import { Address, PaymentStatus, UserOrders } from "@/types/order.type";

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";

export type UserOrderDetailsDTO = {
    id: string;
    order_number: string;
    user_id?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    shipping_address?: Address;
    billing_address?: Address;
    status: OrderStatus;
    payment_status?: PaymentStatus;
    subtotal?: number;
    tax?: number;
    shipping_cost?: number;
    total: number;
    notes?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    created_at: string;
    updated_at?: string;
    payment_method?: string
};

export type UserOrderDTO = {
    id: string;
    order_number: string;
    status: OrderStatus;
    total: number;
    created_at: string;
};

export function toUserOrderDTO(
    row: UserOrders
): UserOrderDTO {

    return {
        id: row.id,
        order_number: row.order_number,
        status: row.status as OrderStatus,
        total: Number(row.total),
        created_at: row.created_at
    };
}

export function toUserOrderDetailsDTO(
    row: UserOrders
): UserOrderDetailsDTO {

    return {
        id: row.id,
        order_number: row.order_number,
        user_id: row.user_id,
        customer_name: row.customer_name,
        customer_email: row.customer_email,
        customer_phone: row.customer_phone,
        shipping_address: row.shipping_address,
        billing_address: row.billing_address,
        status: row.status,
        payment_status: row.payment_status,
        subtotal:
            row.subtotal !== undefined
                ? Number(row.subtotal)
                : undefined,
        tax:
            row.tax !== undefined
                ? Number(row.tax)
                : undefined,
        shipping_cost:
            row.shipping_cost !== undefined
                ? Number(row.shipping_cost)
                : undefined,
        total: Number(row.total),
        notes: row.notes,
        razorpay_order_id: row.razorpay_order_id,
        razorpay_payment_id: row.razorpay_payment_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        payment_method: row.payment_method
    };
}