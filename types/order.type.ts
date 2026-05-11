export interface UserOrders {
    id: string;
    order_number: string;
    user_id?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    shipping_address?: string;
    billing_address?: string;
    status: 'confirmed' | 'pending';
    payment_status?: 'paid' | 'pending';
    subtotal?: number;
    tax?: number;
    shipping_cost?: number
    total: number
    notes?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    created_at: string;
    updated_at?: string;
}