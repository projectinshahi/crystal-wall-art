import { NextResponse } from "next/server";
import { withHandler } from "@/lib/api/handler";
import { writeQuery } from "@/lib/db"; // ✅ writeQuery, not readQuery

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const items = body.items ?? [];
    const userId = user?.id;

    if (!items.length) {
      return NextResponse.json({ success: true });
    }

    const keyOf = (item: any) =>
      `${item.product_id}_${item.size}_${item.thickness}_${item.mounting_method}_${item.orientation}_${item.variant_id ?? ""}`;

    const dedupedItems = Array.from(
      items.reduce((map:any, item: any) => {
        const key = keyOf(item);
        const existing = map.get(key);

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          map.set(key, { ...item, quantity: item.quantity });
        }

        return map;
      }, new Map<string, any>())
      .values()
    );

    const existingCart = await writeQuery(
      `SELECT * FROM cart_items WHERE user_id = $1`,
      [userId]
    );

    const existingMap = new Map(
      existingCart.map((item: any) => [keyOf(item), item])
    );

    const toInsert: any[] = [];
    const toUpdate: Array<{ item: any; existingQuantity: number }> = [];

    dedupedItems.forEach((item:any) => {
      const key = keyOf(item);
      const existingItem = existingMap.get(key);

      if (!existingItem) {
        toInsert.push(item);
      } else if (existingItem.quantity !== item.quantity) {
        toUpdate.push({ item, existingQuantity: Number(existingItem.quantity) });
      }
    });

    if (toInsert.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];

      toInsert.forEach((item: any, i: number) => {
        const base = i * 8;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`
        );
        values.push(
          userId,
          item.product_id,
          item.size,
          item.thickness,
          item.mounting_method,
          item.orientation,
          item.variant_id ?? null,
          item.quantity
        );
      });

      await writeQuery(
        `
        INSERT INTO cart_items (
          user_id, product_id, size, thickness,
          mounting_method, orientation, variant_id, quantity
        )
        VALUES ${placeholders.join(",")}
        `,
        values
      );
    }

    for (const { item, existingQuantity } of toUpdate) {
      await writeQuery(
        `
        UPDATE cart_items
        SET quantity = $1,
            updated_at = NOW()
        WHERE user_id = $2
          AND product_id = $3
          AND size = $4
          AND thickness = $5
          AND mounting_method = $6
          AND orientation = $7
          AND (
            variant_id = $8
            OR (variant_id IS NULL AND $8 IS NULL)
          )
        `,
        [
          existingQuantity + item.quantity,
          userId,
          item.product_id,
          item.size,
          item.thickness,
          item.mounting_method,
          item.orientation,
          item.variant_id ?? null,
        ]
      );
    }

    return NextResponse.json({ success: true });
  },
  { access: "user" }
);