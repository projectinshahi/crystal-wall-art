interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  one_click_checkout?: boolean;
  show_coupons?: boolean;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  shipping_address?: RazorpayAddress;
  billing_address?: RazorpayAddress;
  razorpay_shipping_address?: RazorpayAddress;
  razorpay_billing_address?: RazorpayAddress;
  customer_details?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

interface RazorpayAddress {
  name?: string;
  contact?: string;
  line1?: string;
  line2?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  pincode?: string;
  country?: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: { error: { description: string } }) => void): void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}