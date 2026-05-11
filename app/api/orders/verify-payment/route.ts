import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import { writeQuery } from "@/lib/db";
import crypto from "crypto";

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      shipping_address,
      billing_address,
    } = body;

    console.log("[verify-payment] body:", JSON.stringify(body, null, 2));

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { verified: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Verify signature server-side
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("[verify-payment] expectedSignature:", expectedSignature);
    console.log("[verify-payment] receivedSignature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("[verify-payment] ❌ Signature mismatch");
      return NextResponse.json(
        { verified: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log("[verify-payment] ✅ Signature valid");

    // 2️⃣ Update order as paid
    await writeQuery(
      `
      UPDATE orders SET
        payment_status = 'paid',
        status = 'confirmed',
        razorpay_order_id = $1,
        razorpay_payment_id = $2,
        shipping_address = COALESCE($3::jsonb, shipping_address),
        billing_address = COALESCE($4::jsonb, billing_address),
        updated_at = now()
      WHERE id = $5
      `,
      [
        razorpay_order_id,
        razorpay_payment_id,
        shipping_address ? JSON.stringify(shipping_address) : null,
        billing_address ? JSON.stringify(billing_address) : null,
        order_id,
      ]
    );

    console.log("[verify-payment] order updated to paid:", order_id);

    // 3️⃣ Insert confirmed timeline entry
    await writeQuery(
      `
      INSERT INTO order_timeline (order_id, status, note)
      VALUES ($1, 'confirmed', $2)
      `,
      [order_id, `Payment confirmed — Razorpay ID: ${razorpay_payment_id}`]
    );

    console.log("[verify-payment] ✅ timeline updated");
    return NextResponse.json({ verified: true });
  },
  { access: "user" }
);