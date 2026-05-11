import { ok, withHandler } from "@/lib/api/handler";
import { readQuery, writeQuery } from "@/lib/db";
import { CartItem } from "@/store/cartStore";

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const incoming: CartItem[] = body.items || [];
    const userId = user.id;

    console.log("[cart/sync] Incoming items:", JSON.stringify(incoming, null, 2));

    // ✅ Key includes variant_id to correctly identify unique cart rows
    const keyOf = (i: any) =>
      `${i.product_id}_${i.size}_${i.thickness}_${i.mounting_method}_${i.orientation}_${i.variant_id ?? ""}`;

    // 1️⃣ Get existing DB cart
    const existing = await readQuery(
      `SELECT * FROM cart_items WHERE user_id = $1`,
      [userId]
    );

    console.log("[cart/sync] Existing DB items:", existing);

    const existingMap = new Map(existing.map((i: any) => [keyOf(i), i]));
    const incomingMap = new Map(incoming.map((i) => [keyOf(i), i]));

    const toInsert: CartItem[] = [];
    const toUpdate: CartItem[] = [];
    const toDelete: any[] = [];

    // 2️⃣ Determine inserts and updates
    for (const item of incoming) {
      const key = keyOf(item);
      const existingItem = existingMap.get(key);

      if (!existingItem) {
        toInsert.push(item);
      } else if (existingItem.quantity !== item.quantity) {
        toUpdate.push(item);
      }
    }

    // 3️⃣ Determine deletes (items in DB but not in incoming)
    for (const existingItem of existing) {
      if (!incomingMap.has(keyOf(existingItem))) {
        toDelete.push(existingItem);
      }
    }

    console.log("[cart/sync] toInsert:", toInsert);
    console.log("[cart/sync] toUpdate:", toUpdate);
    console.log("[cart/sync] toDelete:", toDelete);

    // 4️⃣ DELETES
    if (toDelete.length > 0) {
      for (const item of toDelete) {
        await writeQuery(
          `
          DELETE FROM cart_items
          WHERE user_id = $1
            AND product_id = $2
            AND size = $3
            AND thickness = $4
            AND mounting_method = $5
            AND orientation = $6
            AND (
              variant_id = $7
              OR (variant_id IS NULL AND $7 IS NULL)
            )
          `,
          [
            userId,
            item.product_id,
            item.size,
            item.thickness,
            item.mounting_method,
            item.orientation,
            item.variant_id ?? null, // ✅ correct snake_case from DB row
          ]
        );
      }
      console.log("[cart/sync] Deleted:", toDelete.length);
    }

    // 5️⃣ INSERTS
    if (toInsert.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];

      toInsert.forEach((item, i) => {
        const base = i * 8; // ✅ 8 columns, not 9

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

      console.log("[cart/sync] Inserting values:", values);

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

      console.log("[cart/sync] Inserted:", toInsert.length);
    }

    // 6️⃣ UPDATES
    for (const item of toUpdate) {
      console.log("[cart/sync] Updating:", item);

      const updated = await writeQuery(
        `
        UPDATE cart_items
        SET quantity = $1
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
        RETURNING *
        `,
        [
          item.quantity,
          userId,
          item.product_id,
          item.size,
          item.thickness,
          item.mounting_method,
          item.orientation,
          item.variant_id ?? null,
        ]
      );

      console.log("[cart/sync] Updated row:", updated);
    }

    return ok({
      inserted: toInsert.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
    });
  },
  { access: "user" }
);