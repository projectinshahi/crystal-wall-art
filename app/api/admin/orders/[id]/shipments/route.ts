import { okList, withHandler } from "@/lib/api/handler";
import { getAdminOrderedShipmentsByOrderId } from "@/lib/db/repositories/admin/orders.admin.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ params }): Promise<NextResponse> => {
        const routeParams = await params;

        const orderId = routeParams?.id;
        
        const shipments = await getAdminOrderedShipmentsByOrderId(orderId as string)

        const response = okList(shipments);

        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response;
    }
)