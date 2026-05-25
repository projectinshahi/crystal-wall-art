import { okList, withHandler } from "@/lib/api/handler";
import { getPublicCategories } from "@/lib/db/repositories/public/category.public.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async (): Promise<NextResponse> => {

        try {

            console.log("[GET /api/categories] Request started");

            const categories = await getPublicCategories();

            console.log(
                "[GET /api/categories] Categories fetched:",
                categories?.length || 0
            );

            const response = okList(categories, {});

            response.headers.set(
                "Cache-Control",
                "public, max-age=300, s-maxage=600"
            );

            console.log("[GET /api/categories] Response sent");

            return response;

        } catch (err: any) {

            console.error(
                "[GET /api/categories] Error:",
                err?.message || err
            );

            throw err;
        }
    },
    { access: "public" }
);
