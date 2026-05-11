import { ok, withHandler } from "@/lib/api/handler";
import { CartRepository } from "@/lib/db/repositories/user/cart.user.repository";

export const POST = withHandler(
  async ({ user }) => {
    await CartRepository.clearCart(user.id);
    return ok({ success: true });
  },
  { access: "user" }
);