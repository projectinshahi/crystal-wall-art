import { ok, okList, withHandler } from "@/lib/api/handler";
import { getPublicProductByCategoryId } from "@/lib/db/repositories/public/product.public.repository";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ req, params }): Promise<NextResponse> => {

        const routeParams = await params;

        const categoryId = routeParams?.id;

        const productData = await getPublicProductByCategoryId(categoryId as string);
        
        const response = okList(productData, {});

        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response

    }
)