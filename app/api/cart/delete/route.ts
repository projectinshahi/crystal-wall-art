import { ok, withHandler } from "@/lib/api/handler";
import { CartRepository } from "@/lib/db/repositories/user/cart.public.repository";

export const POST = withHandler(
  async ({ req, user }) => {
    const {
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
    } = await req.json();

    await CartRepository.deleteItem([
      user.id,
      product_id,
      size,
      thickness,
      mounting_method,
      orientation,
    ]);

    return ok({ success: true });
  },
  { access: "user" }
);