import { ok, withHandler } from "@/lib/api/handler";
import { getOrderStatusByOrderNumber } from "@/lib/db/repositories/public/order.public.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ req }): Promise<NextResponse> => {

        const { searchParams } = new URL(req.url);

        const orderNumber = searchParams.get("orderNumber");

        const order = await getOrderStatusByOrderNumber(orderNumber as string)

        const response = ok({ data: order });

        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response;
    }, { access: "public" }

)