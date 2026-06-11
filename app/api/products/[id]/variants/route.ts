import { ok, okList, withHandler } from "@/lib/api/handler";
import { getPublicProductVariants } from "@/lib/db/repositories/public/product.public.repository";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export const GET = withHandler(
    async ({ params }): Promise<NextResponse> => {
        const routeParams = await params;

        const productId = routeParams?.id;

        const variants = await getPublicProductVariants(productId as string);

        const response = okList(variants, {});

        response.headers.set(
            "Cache-Control",
            "no-store"
        );

        return response
    }, { access: "public" }
)

// export async function GET(req: NextRequest, { params }: Params) {
//     try {

//         const { id } = await params;

//         const { success, error, data, meta } = await getVariantsByProducts({ id });

//         if (!success) {
//             return Response.json({
//                 success: false,
//                 data: null,
//                 error: error
//             });
//         }

//         return Response.json({
//             success: true,
//             data: data,
//             meta
//         });
//     } catch (error: any) {
//         console.error("❌ PRODUCT VARIANTS FETCH ERROR:", error);

//         const status =
//             error.message === "Unauthorized" ? 401 :
//                 error.message === "Forbidden" ? 403 :
//                     500;

//         return Response.json(
//             {
//                 success: false,
//                 message: error.message || "Internal server error",
//             },
//             { status }
//         );
//     }
// }