import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import { writeQuery } from "@/lib/db"; // ✅ writeQuery, not readQuery

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const items = body.items ?? [];

    console.log("[cart/merge] Incoming items:", JSON.stringify(items, null, 2));

    if (!items.length) {
      console.log("[cart/merge] No items, returning early");
      return NextResponse.json({ success: true });
    }

    const values: any[] = [];
    const placeholders: string[] = [];

    items.forEach((item: any, i: number) => {
      const base = i * 8; // ✅ 8 columns, base offset of 8

      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`
      );

      values.push(
        user?.id,
        item.product_id,
        item.size,
        item.thickness,
        item.mounting_method,
        item.orientation,
        item.variant_id ?? null, // ✅ always explicit null
        item.quantity
      );

      console.log(`[cart/merge] Item ${i + 1}:`, {
        user_id: user?.id,
        product_id: item.product_id,
        size: item.size,
        thickness: item.thickness,
        mounting_method: item.mounting_method,
        orientation: item.orientation,
        variant_id: item.variant_id ?? null,
        quantity: item.quantity,
      });
    });

    const query = `
      INSERT INTO cart_items
        (user_id, product_id, size, thickness, mounting_method, orientation, variant_id, quantity)
      VALUES ${placeholders.join(",")}
      ON CONFLICT (user_id, product_id, size, thickness, mounting_method, orientation, variant_id)
      DO UPDATE SET
        quantity = EXCLUDED.quantity
    `;

    console.log("[cart/merge] Query:", query);
    console.log("[cart/merge] Values:", values);

    try {
      await writeQuery(query, values);
      console.log("[cart/merge] Success");
    } catch (err) {
      console.error("[cart/merge] Failed:", err);
      throw err;
    }

    return NextResponse.json({ success: true });
  },
  { access: "user" }
);