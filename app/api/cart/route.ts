import { okList, withHandler } from "@/lib/api/handler";
import { NextResponse } from "next/server";
import { CartRepository } from "@/lib/db/repositories/user/cart.user.repository";

export const GET = withHandler(
  async ({ user }): Promise<NextResponse> => {
    
    const cartItems = await CartRepository.getAll(user.id)

    const response = okList(cartItems);

    response.headers.set(
      "Cache-Control",
      "no-store"
    );

    return response;
  },
  { access: "user" }
);