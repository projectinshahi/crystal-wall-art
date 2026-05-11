export const CartUserQueries = {
  getAll: `
    SELECT
      ci.id,
      ci.product_id,
      ci.size,
      ci.thickness,
      ci.mounting_method,
      ci.orientation,
      ci.quantity,
      ci.created_at,

      -- product info
      p.title AS title,
      p.price,
      (p.thumbnail::json ->> 'url') AS image

    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id

    WHERE ci.user_id = $1
    ORDER BY ci.created_at DESC
  `,
  upsert: `
    INSERT INTO cart_items (
      user_id,
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
      quantity
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)

    ON CONFLICT (
      user_id,
      product_id,
      size,
      thickness,
      mounting_method,
      orientation
    )
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity
  `,
  updateQuantity: `
    UPDATE cart_items
    SET quantity = $1,
        updated_at = NOW()
    WHERE
      user_id = $2
      AND product_id = $3
      AND size = $4
      AND thickness = $5
      AND mounting_method = $6
      AND orientation = $7
    RETURNING *
  `,
  changeQuantity: `
    UPDATE cart_items
    SET quantity = quantity + $1,
        updated_at = NOW()
    WHERE
      user_id = $2
      AND product_id = $3
      AND size = $4
      AND thickness = $5
      AND mounting_method = $6
      AND orientation = $7
    RETURNING *
  `,
  deleteItem: `
    DELETE FROM cart_items
    WHERE
      user_id = $1
      AND product_id = $2
      AND size = $3
      AND thickness = $4
      AND mounting_method = $5
      AND orientation = $6
    RETURNING *
  `,
  clearCart: `
    DELETE FROM cart_items
    WHERE user_id = $1
  `,
  getOne: `
    SELECT *
    FROM cart_items
    WHERE
      user_id = $1
      AND product_id = $2
      AND size = $3
      AND thickness = $4
      AND mounting_method = $5
      AND orientation = $6
    LIMIT 1
  `,
};