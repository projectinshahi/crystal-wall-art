import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import Razorpay from "razorpay";

export const POST = withHandler(
  async ({ req, user }) => {
    // ✅ Instantiate inside handler so env vars are always resolved
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    console.log("[razorpay/create-order] key_id:", process.env.RAZORPAY_KEY_ID);
    console.log("[razorpay/create-order] secret set:", !!process.env.RAZORPAY_KEY_SECRET);

    const body = await req.json();
    const { amount, currency = "INR", receipt, notes, line_items, customer } = body;

    console.log("[razorpay/create-order] body:", JSON.stringify(body, null, 2));

    if (!amount || !receipt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Only send line_items if using Magic Checkout (1CC)
    // For standard checkout, skip line_items entirely to avoid BAD_REQUEST errors
    const orderPayload: any = {
      amount: Math.round(amount) * 100,
      currency,
      receipt,
      notes,
    };

    console.log("[razorpay/create-order] orderPayload:", JSON.stringify(orderPayload, null, 2));

    try {
      const order = await razorpay.orders.create(orderPayload);
      console.log("[razorpay/create-order] ✅ order created:", order.id);

      return NextResponse.json({
        order,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err: any) {
      console.error("[razorpay/create-order] ❌ Razorpay error:", JSON.stringify(err, null, 2));
      return NextResponse.json(
        { error: err?.error?.description || "Razorpay order creation failed" },
        { status: 500 }
      );
    }
  },
  { access: "user" }
);