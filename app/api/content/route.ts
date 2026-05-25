import { okList, withHandler } from "@/lib/api/handler";
import { getContents } from "@/lib/db/content.db";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ req }): Promise<NextResponse> => {

        // Parse query params
        const { searchParams } = new URL(req.url);

        const type = searchParams.get("type") ?? undefined;

        const activeParam = searchParams.get("active");

        const is_active =
            activeParam === null
                ? undefined
                : activeParam === "true";

        const contents: any = await getContents({
            type,
            is_active,
        });

        const response = okList(contents, {});

        response.headers.set(
            "Cache-Control",
            "public, max-age=300, s-maxage=600"
        );

        return response;
    },
    { access: "public" }
);