import { okList, withHandler } from "@/lib/api/handler";
import { getAllCategories } from "@/lib/db/categories.db";
import { getPublicCategories } from "@/lib/db/repositories/public/category.public.repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = withHandler(
    async (): Promise<NextResponse> => {
        const categories = await getPublicCategories()

        const response = okList(categories, {});
        
        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response;
    },{access: "public"}
)