import { getProductById } from "@/lib/db/product.db";
import { NextRequest } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params) {
    try {

        const { id } = await params;

        const { success, error, data, meta } = await getProductById({ id, is_active: true });

        if (!success) {
            return Response.json({
                success: false,
                data: null,
                error: error
            });
        }

        return Response.json({
            success: true,
            data: data,
            meta
        });
    } catch (error: any) {
        console.error("❌ PRODUCT FETCH ERROR:", error);

        const status =
            error.message === "Unauthorized" ? 401 :
                error.message === "Forbidden" ? 403 :
                    500;

        return Response.json(
            {
                success: false,
                message: error.message || "Internal server error",
            },
            { status }
        );
    }
}