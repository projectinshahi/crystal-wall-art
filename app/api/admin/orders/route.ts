import { okList, withHandler } from "@/lib/api/handler";
import { getAdminOrders } from "@/lib/db/repositories/admin/orders.admin.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ req }): Promise<NextResponse> => {

        // ─────────────────────────────────────
        // QUERY PARAMS
        // ─────────────────────────────────────
        const searchParams = req.nextUrl.searchParams;

        const page = Math.max(1, Number(searchParams.get("page")) || 1);

        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));

        const orders = await getAdminOrders({ page: page || 1, limit: limit || 20 });

        const response = okList(
            orders.data,
            {
                pagination: orders.pagination,
            }
        );

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "admin" }
)