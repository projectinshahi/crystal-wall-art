import { ok, withHandler } from "@/lib/api/handler";
import { CartRepository } from "@/lib/db/repositories/user/cart.user.repository";

export const POST = withHandler(
  async ({ req, user }) => {
    const {
      delta, // +1 or -1
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
    } = await req.json();

    const [item] = await CartRepository.changeQuantity([
      delta,
      user.id,
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
    ]);

    return ok({ item });
  },
  { access: "user" }
);