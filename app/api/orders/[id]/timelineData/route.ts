import { okList, withHandler } from "@/lib/api/handler";
import { getOrderTimelineData } from "@/lib/db/repositories/user/orders.user.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ params }): Promise<NextResponse> => {

        const routeParams = await params;

        const orderId = routeParams?.id;

        const itemsData = await getOrderTimelineData(orderId as string);

        const response = okList(itemsData, {})

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "user" }
)