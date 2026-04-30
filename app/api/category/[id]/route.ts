import { getAllCategories, getCategoryById } from "@/lib/db/categories.db";
import { NextRequest } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
    try {

        const { id } = await params;

        // Parse query params
        const { searchParams } = new URL(req.url);
        const activeParam = searchParams.get('active');
        const is_active = activeParam === null ? undefined : activeParam === 'true';

        // Replace with your DB/service
        const { data, meta } = await getCategoryById({ id, is_active });

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