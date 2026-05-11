import { okList, withHandler } from "@/lib/api/handler";
import { getUserOrders } from "@/lib/db/repositories/user/orders.user.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({user}): Promise<NextResponse> => {

        const orders = await getUserOrders(user.id);

        const response = okList(orders, {})
        
                response.headers.set(
                    "Cache-Control",
                    "private, no-store"
                );
        
                return response;
    }, {access: "user"}
)