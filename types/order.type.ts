export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";;

export type PaymentStatus =
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

export type Address = {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
};

export interface UserOrders {
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
    payment_method?: string;
}

export interface OrderResult {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: { product_title: string; quantity: number; unit_price: number }[];
}