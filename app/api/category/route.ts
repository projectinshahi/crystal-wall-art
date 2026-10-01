import { err, okList, withHandler } from "@/lib/api/handler";
import { getPublicCategories } from "@/lib/db/repositories/public/category.public.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ req }): Promise<NextResponse> => {

        try {
            // ?parent=<id> → subcategories of that category; otherwise main categories
            const parent = req.nextUrl.searchParams.get("parent");

            if (parent && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parent)) {
                return err("Invalid category id", 400);
            }

            const categories = await getPublicCategories(parent);

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
