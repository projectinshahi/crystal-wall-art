import { okList, withHandler } from "@/lib/api/handler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { CartRepository } from "@/lib/db/repositories/user/cart.public.repository";
import { readQuery } from "@/lib/db";
import { CartUserQueries } from "@/lib/db/queries/user/user.public.queries";

export const GET = withHandler(
  async ({ user }): Promise<NextResponse> => {
    
    const cartItems = await CartRepository.getAll(user.id)

    const response = okList(cartItems);

    response.headers.set(
      "Cache-Control",
      "private, max-age=300, s-maxage=600"
    );

    return response;
  },
  { access: "user" }
);