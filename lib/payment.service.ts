import { FormInputProps } from "@/components/Checkout/CheckoutPage";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { loadRazorpayScript } from "./razorpay";

interface Props {
  form: FormInputProps;
  cartItems: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  appliedCoupon?: { id: string; code: string } | null;
  setSubmitting: (submitting: boolean) => void;
  router: any;
}

export const handleRazorpaySubmit = async ({
  form,
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  appliedCoupon,
  setSubmitting,
  router,
}: Props) => {
  console.log("[razorpay] ▶ handleRazorpaySubmit called");
  console.log("[razorpay] form:", JSON.stringify(form, null, 2));
  console.log("[razorpay] cartItems:", JSON.stringify(cartItems, null, 2));
  console.log("[razorpay] pricing:", { subtotal, tax, shipping, total });
  console.log("[razorpay] appliedCoupon:", appliedCoupon);

  if (!form.name.trim() || !form.email.trim()) {
    toast.error("Name and email are required");
    return;
  }

  if (cartItems.length === 0) {
    toast.error("Cart is empty");
    return;
  }

  setSubmitting(true);

  try {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    console.log("[razorpay] orderNumber:", orderNumber);

    // 1️⃣ Create order in DB
    console.log("[razorpay] 1️⃣ Creating order in DB...");
    const orderRes = await fetch("/api/orders/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        items: cartItems,
        form,
        subtotal,
        tax,
        shipping,
        total,
        appliedCoupon,
        paymentMethod: "razorpay",
      }),
    });

    console.log("[razorpay] /api/orders/create status:", orderRes.status);

    if (!orderRes.ok) {
      const err = await orderRes.json();
      console.error("[razorpay] Order creation failed:", err);
      throw new Error(err.error || "Failed to create order");
    }

    const { order } = await orderRes.json();
    console.log("[razorpay] Order created:", JSON.stringify(order, null, 2));

    // 2️⃣ Create Razorpay order via server
    console.log("[razorpay] 2️⃣ Creating Razorpay order...");
    const lineItems = cartItems.map((item, idx) => ({
      id: item.variant_id || item.product_id || `item-${idx}`,
      sku: item.variant_id || item.product_id || `SKU-${idx}`,
      variant_id: item.variant_id || item.product_id || `var-${idx}`,
      product_id: item.product_id || `p-${idx}`,
      name: item.title,
      description:
        [item.size, item.thickness].filter(Boolean).join(" ") || item.title,
      price: item.price,
      offer_price: item.price,
      quantity: item.quantity,
      image_url: item.image || "",
    }));

    console.log("[razorpay] lineItems:", JSON.stringify(lineItems, null, 2));

    const rzpOrderPayload = {
      amount: total,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        order_id: order.id,
        customer_email: form.email.trim(),
      },
      line_items: lineItems,
      customer: {
        email: form.email.trim(),
        contact: form.phone?.trim() || undefined,
        shipping_address: form.address
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              contact: form.phone?.trim() || undefined,
              line1: form.address,
              city: form.city,
              state: form.state,
              zipcode: form.pincode,
              country: "in",
              type: "shipping_address",
            }
          : undefined,
      },
    };

    console.log("[razorpay] /api/razorpay/create-order payload:", JSON.stringify(rzpOrderPayload, null, 2));

    const rzpOrderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rzpOrderPayload),
    });

    console.log("[razorpay] /api/razorpay/create-order status:", rzpOrderRes.status);

    if (!rzpOrderRes.ok) {
      const err = await rzpOrderRes.json();
      console.error("[razorpay] Razorpay order creation failed:", err);
      throw new Error(err.error || "Payment order creation failed");
    }

    const rzpData = await rzpOrderRes.json();
    console.log("[razorpay] Razorpay order data:", JSON.stringify(rzpData, null, 2));

    // 3️⃣ Open Razorpay checkout
    console.log("[razorpay] 3️⃣ Opening Razorpay checkout...");
    // if (!window.Razorpay) throw new Error("Razorpay SDK not loaded");

    await loadRazorpayScript();
    const rzp = new window.Razorpay({
      key: rzpData.key_id,
      amount: rzpData.order.amount,
      currency: rzpData.order.currency,
      name: "Crystal Art",
      description: `Order ${orderNumber}`,
      order_id: rzpData.order.id,
      one_click_checkout: true,
      show_coupons: false,
      prefill: {
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.phone?.trim(),
      },
      theme: { color: "#14b8a6" },

      handler: async (response) => {
        console.log("[razorpay] ✅ Payment handler called");
        console.log("[razorpay] Payment response:", JSON.stringify(response, null, 2));

        try {
          const ship =
            response.shipping_address || response.razorpay_shipping_address;
          const bill =
            response.billing_address || response.razorpay_billing_address;

          console.log("[razorpay] shipping from response:", ship);
          console.log("[razorpay] billing from response:", bill);

          const normalisedShipping = ship
            ? {
                name: ship.name || form.name,
                phone: ship.contact || form.phone,
                address: ship.line1 || ship.address || "",
                line2: ship.line2 || "",
                city: ship.city || form.city,
                state: ship.state || form.state,
                pincode: ship.zipcode || ship.pincode || form.pincode,
                country: ship.country || "IN",
              }
            : null;

          console.log("[razorpay] normalisedShipping:", normalisedShipping);

          // 4️⃣ Verify payment server-side
          console.log("[razorpay] 4️⃣ Verifying payment...");
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: order.id,
            shipping_address: normalisedShipping,
            billing_address: bill || null,
          };
          console.log("[razorpay] verify payload:", JSON.stringify(verifyPayload, null, 2));

          const verifyRes = await fetch("/api/orders/verify-payment", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verifyPayload),
          });

          console.log("[razorpay] /api/orders/verify-payment status:", verifyRes.status);

          const verifyData = await verifyRes.json();
          console.log("[razorpay] verify response:", JSON.stringify(verifyData, null, 2));

          if (!verifyRes.ok || !verifyData.verified) {
            console.error("[razorpay] ❌ Payment verification failed");
            toast.error("Payment verification failed");
            setSubmitting(false);
            return;
          }

          console.log("[razorpay] ✅ Payment verified successfully");

          // 5️⃣ Increment coupon usage (non-critical)
          if (appliedCoupon) {
            console.log("[razorpay] 5️⃣ Incrementing coupon usage:", appliedCoupon);
            await fetch("/api/coupons/use", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ coupon_id: appliedCoupon.id }),
            }).catch((e) => console.warn("[razorpay] Coupon usage update failed:", e));
          }

          // 6️⃣ Clear cart and redirect
          console.log("[razorpay] 6️⃣ Clearing cart and redirecting...");
          useCartStore.getState().clearCart();
          toast.success("Payment successful!", {
            description: `Order #${orderNumber}`,
          });
          router.push(`/order-success/${orderNumber}`);
        } catch (err) {
          console.error("[razorpay] ❌ Error in payment handler:", err);
          toast.error("Payment verification error");
          setSubmitting(false);
        }
      },

      modal: {
        ondismiss: () => {
          console.log("[razorpay] Modal dismissed by user");
          toast.info("Payment cancelled");
          setSubmitting(false);
        },
      },
    });

    rzp.on("payment.failed", (r) => {
      console.error("[razorpay] ❌ Payment failed:", r);
      toast.error("Payment failed", {
        description: r.error?.description,
      });
      setSubmitting(false);
    });

    console.log("[razorpay] Calling rzp.open()");
    rzp.open();
  } catch (error: any) {
    console.error("[razorpay] ❌ Unhandled error:", error);
    toast.error("Failed to initiate payment", {
      description: error.message,
    });
    setSubmitting(false);
  }
};

export const handleCODSubmit = async ({
  form,
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  appliedCoupon,
  setSubmitting,
  router,
}: Props) => {
  console.log("[cod] ▶ handleCODSubmit called");
  console.log("[cod] form:", JSON.stringify(form, null, 2));
  console.log("[cod] cartItems:", JSON.stringify(cartItems, null, 2));
  console.log("[cod] pricing:", { subtotal, tax, shipping, total });

  if (!form.name.trim() || !form.email.trim()) {
    toast.error("Name and email are required");
    return;
  }

  if (cartItems.length === 0) {
    toast.error("Cart is empty");
    return;
  }

  setSubmitting(true);

  try {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    console.log("[cod] orderNumber:", orderNumber);

    console.log("[cod] 1️⃣ Creating COD order in DB...");
    const orderRes = await fetch("/api/orders/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        items: cartItems,
        form,
        subtotal,
        tax,
        shipping,
        total,
        appliedCoupon,
        paymentMethod: "cod",
      }),
    });

    console.log("[cod] /api/orders/create status:", orderRes.status);

    if (!orderRes.ok) {
      const err = await orderRes.json();
      console.error("[cod] Order creation failed:", err);
      throw new Error(err.error || "Failed to create order");
    }

    const { order } = await orderRes.json();
    console.log("[cod] Order created:", JSON.stringify(order, null, 2));

    // Increment coupon usage (non-critical)
    if (appliedCoupon) {
      console.log("[cod] Incrementing coupon usage:", appliedCoupon);
      await fetch("/api/coupons/use", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon_id: appliedCoupon.id }),
      }).catch((e) => console.warn("[cod] Coupon usage update failed:", e));
    }

    console.log("[cod] ✅ COD order placed, clearing cart and redirecting...");
    useCartStore.getState().clearCart();
    toast.success("Order placed!", {
      description: `Order #${orderNumber} confirmed`,
    });
    router.push(`/order-success/${order.id}`);
  } catch (error: any) {
    console.error("[cod] ❌ Unhandled error:", error);
    toast.error("Failed to place order", {
      description: error.message,
    });
    setSubmitting(false);
  }
};