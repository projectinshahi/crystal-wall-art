import { ok, withHandler } from "@/lib/api/handler";
import { readQuery, writeQuery } from "@/lib/db";
import { CartItem } from "@/store/cartStore";

export const POST = withHandler(
  async ({ req, user }) => {
    const body = await req.json();
    const incoming: CartItem[] = body.items || [];

    const userId = user.id;

    // 1️⃣ Get existing cart
    const existing = await readQuery(
      `
      SELECT *
      FROM cart_items
      WHERE user_id = $1
      `,
      [userId]
    );

    // 2️⃣ Create maps for fast lookup
    const keyOf = (i: CartItem) =>
      `${i.product_id}_${i.size}_${i.thickness}_${i.mounting_method}_${i.orientation}`;

    const existingMap = new Map(
      existing.map((i: any) => [keyOf(i), i])
    );

    const incomingMap = new Map(
      incoming.map((i) => [keyOf(i), i])
    );

    const toInsert: any[] = [];
    const toUpdate: any[] = [];
    const toDelete: any[] = [];

    // 3️⃣ INSERT + UPDATE
    for (const item of incoming) {
      const key = keyOf(item);
      const existingItem = existingMap.get(key);

      if (!existingItem) {
        toInsert.push(item);
      } else if (existingItem.quantity !== item.quantity) {
        toUpdate.push(item);
      }
    }

    // 4️⃣ DELETE removed items
    for (const existingItem of existing) {
      const key = keyOf(existingItem as any);

      if (!incomingMap.has(key)) {
        toDelete.push(existingItem);
      }
    }

    // 5️⃣ EXECUTE DELETES
    if (toDelete.length > 0) {
      await writeQuery(
        `
        DELETE FROM cart_items
        WHERE user_id = $1
        AND (product_id, size, thickness, mounting_method, orientation)
        IN (${toDelete
          .map(
            (_, i) =>
              `($${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5}, $${i * 5 + 6})`
          )
          .join(",")})
        `,
        [
          userId,
          ...toDelete.flatMap((i) => [
            i.productId,
            i.size,
            i.thickness,
            i.mountingMethod,
            i.orientation,
          ]),
        ]
      );
    }

    // 6️⃣ EXECUTE INSERTS
    if (toInsert.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];

      toInsert.forEach((item, i) => {
        const base = i * 7;

        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`
        );

        values.push(
          userId,
          item.productId,
          item.size,
          item.thickness,
          item.mountingMethod,
          item.orientation,
          item.quantity
        );
      });

      await writeQuery(
        `
        INSERT INTO cart_items (
          user_id,
          product_id,
          size,
          thickness,
          mounting_method,
          orientation,
          quantity
        )
        VALUES ${placeholders.join(",")}
        `,
        values
      );
    }

    // 7️⃣ EXECUTE UPDATES
    for (const item of toUpdate) {
      await writeQuery(
        `
        UPDATE cart_items
        SET quantity = $1
        WHERE user_id = $2
        AND product_id = $3
        AND size = $4
        AND thickness = $5
        AND mounting_method = $6
        AND orientation = $7
        `,
        [
          item.quantity,
          userId,
          item.productId,
          item.size,
          item.thickness,
          item.mountingMethod,
          item.orientation,
        ]
      );
    }

    return ok({
      inserted: toInsert.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
    });
  },
  { access: "user" }
);