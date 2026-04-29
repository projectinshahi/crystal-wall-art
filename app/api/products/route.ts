import { getProducts } from "@/lib/db/product.db";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {

        // Parse query params
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") ?? undefined;
        const is_active = true;

        // Replace with your DB/service
        const { data, meta } = await getProducts({ category, is_active });

        return Response.json({
            success: true,
            data: data,
            meta
        });

    } catch (error: any) {
        console.error("❌ CATEGORIES FETCH ERROR:", error);

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