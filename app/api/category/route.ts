import { okList, withHandler } from "@/lib/api/handler";
import { getPublicCategories } from "@/lib/db/repositories/public/category.public.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async (): Promise<NextResponse> => {

        try {
            const categories = await getPublicCategories();

            console.log(
                "[GET /api/categories] Categories fetched:",
                categories?.length || 0
            );

            const response = okList(categories, {});

            response.headers.set(
                "Cache-Control",
                "no-store"
            );

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
