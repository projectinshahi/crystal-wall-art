import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import { readQuery } from "@/lib/db";

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const items = body.items ?? [];

    if (!items.length) {
      return NextResponse.json({ success: true });
    }

    // Build bulk insert
    const values: any[] = [];
    const placeholders: string[] = [];

    items.forEach((item: any, i: number) => {
      const base = i * 7;

      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
      );

      values.push(
        user?.id,
        item.product_id,
        item.size,
        item.thickness,
        item.mounting_method,
        item.orientation,
        item.quantity
      );
    });

    console.log("values",values);
    

    await readQuery(
      `
      INSERT INTO cart_items
      (user_id, product_id, size, thickness, mounting_method, orientation, quantity)
      VALUES ${placeholders.join(",")}
      ON CONFLICT (user_id, product_id, size, thickness, mounting_method, orientation)
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity
      `,
      values
    );

    return NextResponse.json({ success: true });
  },
  { access: "public" }
);