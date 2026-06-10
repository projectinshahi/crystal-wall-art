import { okList, withHandler } from "@/lib/api/handler";
import { getAdminOrderedItemsByOrderId } from "@/lib/db/repositories/admin/orders.admin.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ params }): Promise<NextResponse> => {
        const routeParams = await params;

        const orderId = routeParams?.id;

        const OrderedItems = await getAdminOrderedItemsByOrderId(orderId as string)

        const response = okList(OrderedItems);

        response.headers.set(
            "Cache-Control",
            "no-store"
        );

        return response;
    }, { access: "admin" }
)