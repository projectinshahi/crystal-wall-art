import { okList, withHandler } from "@/lib/api/handler";
import { getAdminShipmentItemsByShipmentIds } from "@/lib/db/repositories/admin/orders.admin.repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = withHandler(
    async ({
        req,
    }: {
        req: NextRequest;
    }): Promise<NextResponse> => {
        const { searchParams } = new URL(req.url);

        const shipmentIds =
            searchParams.get("shipment_ids")?.split(",") || [];

        const shipmentItems =
            await getAdminShipmentItemsByShipmentIds(shipmentIds);

        const response = okList(shipmentItems);

        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response;
    }
);