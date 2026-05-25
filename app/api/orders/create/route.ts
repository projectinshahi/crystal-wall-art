import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import { writeQuery } from "@/lib/db";

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const {
      orderNumber,
      items,
      form,
      subtotal,
      tax,
      shipping,
      total,
      appliedCoupon,
      paymentMethod,
    } = body;

    console.log("[orders/create] body:", JSON.stringify(body, null, 2));

    if (!orderNumber || !items?.length) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const notes = [
      form.notes?.trim(),
      appliedCoupon ? `Coupon: ${appliedCoupon.code}` : "",
      paymentMethod === "cod"
        ? "Payment: Cash on Delivery"
        : "Payment: Razorpay",
    ]
      .filter(Boolean)
      .join(" | ") || null;

    // 1️⃣ Create order — 11 params + 2 hardcoded = 13 columns
    console.log("[orders/create] inserting order...");
    const orderRows = await writeQuery<any>(
      `
      INSERT INTO orders (
        order_number,
        user_id,
        customer_name,
        customer_email,
        customer_phone,
        subtotal,
        tax,
        shipping_cost,
        total,
        notes,
        shipping_address,
        status,
        payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', 'pending')
      RETURNING *
      `,
      [
        orderNumber,                       // $1
        user.id,                           // $2
        form.name.trim(),                  // $3
        form.email.trim().toLowerCase(),   // $4
        form.phone?.trim() || null,        // $5
        subtotal,                          // $6
        tax,                               // $7
        shipping,                          // $8
        total,                             // $9
        notes,                             // $10
        JSON.stringify({                   // $11
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }),
      ]
    );

    const order = orderRows[0];
    if (!order) throw new Error("Order creation failed");
    console.log("[orders/create] order created:", order.id);

    // 2️⃣ Insert order items — 9 columns, 9 values per row
    const itemValues: any[] = [];
    const itemPlaceholders: string[] = [];

    items.forEach((item: any, i: number) => {
      const base = i * 9;

      itemPlaceholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9})`
      );

      const productTitle = [
        item.title,
        item.size ? `- ${item.size}` : "",
        item.thickness ? `/ ${item.thickness}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      itemValues.push(
        order.id,                                                        // $1 order_id
        item.product_id && !String(item.product_id).startsWith("custom-")
          ? item.product_id
          : null,                                                        // $2 product_id
        item.variant_id ?? null,                                         // $3 variant_id
        productTitle,                                                    // $4 product_title
        item.image || null,                                              // $5 product_image
        item.quantity,                                                   // $6 quantity
        item.price,                                                      // $7 unit_price
        item.price * item.quantity,                                      // $8 total_price
        JSON.stringify({                                                  // $9 options
          size: item.size,
          thickness: item.thickness,
          mounting_method: item.mounting_method,
          orientation: item.orientation,
        })
      );
    });

    console.log("[orders/create] inserting", items.length, "order items...");
    await writeQuery(
      `
      INSERT INTO order_items (
        order_id,
        product_id,
        variant_id,
        product_title,
        product_image,
        quantity,
        unit_price,
        total_price,
        options
      )
      VALUES ${itemPlaceholders.join(",")}
      `,
      itemValues
    );

    // 3️⃣ Insert order timeline
    await writeQuery(
      `
      INSERT INTO order_timeline (order_id, status, note)
      VALUES ($1, 'pending', $2)
      `,
      [
        order.id,
        paymentMethod === "cod"
          ? "Order placed — COD"
          : "Order placed, awaiting payment",
      ]
    );

    console.log("[orders/create] ✅ done");
    return NextResponse.json({ success: true, order });
  },
  { access: "user" }
);