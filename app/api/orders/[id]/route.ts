import { ok, okList, withHandler } from "@/lib/api/handler";
import { getOrderDetails, getUserOrders } from "@/lib/db/repositories/user/orders.user.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ params, user }): Promise<NextResponse> => {

        const routeParams = await params;

        const orderId = routeParams?.id;

        const orderDetail = await getOrderDetails(orderId as string);

        const response = ok({ data: orderDetail })

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "public" }
)