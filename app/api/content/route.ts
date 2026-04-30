import { getContents } from "@/lib/db/content.db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {

        // Parse query params
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') ?? undefined;
        const activeParam = searchParams.get('active');
        const is_active = activeParam === null ? undefined : activeParam === 'true';

        // Replace with your DB/service
        const { data, meta } = await getContents({ type, is_active });

        return Response.json({
            success: true,
            data: data,
            meta
        });

    } catch (error: any) {
        console.error("❌ CONTENT FETCH ERROR:", error);

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