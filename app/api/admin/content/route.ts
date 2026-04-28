import { uploadToCloudinary } from "@/lib/cloudinary.service";
import { addContent, getContents } from "@/lib/db/content.db";
import { requireAdmin } from "@/lib/session";
import { contentApiSchema } from "@/schema/content.schema";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
    try {
        await requireAdmin();

        const formData = await req.formData();

        const type = formData.get("type") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const link_url = formData.get("link_url") as string;
        const priority = Number(formData.get("priority"));

        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "content";

        let finalImage: { url: string; public_id: string } | null = null;

        // ✅ Upload image directly (NO API CALL)
        if (file && file.size > 0) {
            const uploaded = await uploadToCloudinary(file, folder);
            finalImage = uploaded;
        }

        // Data Validation
        const parsed = contentApiSchema.safeParse({
            type,
            title,
            description,
            link_url,
            image: finalImage,
            priority,
        });

        if (!parsed.success) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const dbRes = await addContent(parsed.data)

        if (!dbRes.success) {
            return Response.json(
                {
                    success: false,
                    message: "Insert failed"
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: "Content created successfully",
            data: dbRes.data,
        });

    } catch (error: any) {
        console.error("POST /categories error:", error);

        return Response.json(
            {
                success: false,
                message: error?.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // ✅ Auth inside try
        await requireAdmin();

        // ✅ Parse query params
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 10);

        // ✅ Replace with your DB/service
        const {data, meta} = await getContents({ page, limit });

        return Response.json({
            success: true,
            data: data,
            meta
        });

    } catch (error: any) {
        console.error("❌ PRODUCT FETCH ERROR:", error);

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