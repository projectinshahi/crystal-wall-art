import { ok, withHandler } from "@/lib/api/handler";
import { CartRepository } from "@/lib/db/repositories/user/cart.public.repository";

export const POST = withHandler(
  async ({ req, user }) => {
    const {
      quantity,
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
    } = await req.json();

    const [item] = await CartRepository.updateQuantity([
      quantity,
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