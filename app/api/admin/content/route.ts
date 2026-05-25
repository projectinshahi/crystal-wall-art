import { ApiError } from "@/lib/api/errors";
import { err, ok, okList, withHandler } from "@/lib/api/handler";
import { uploadToCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { AdminContentDTO } from "@/lib/db/dto/contents.dto";
import { createContent, getAdminContents } from "@/lib/db/repositories/admin/content.admin.repository";
import { sanitizeString } from "@/lib/validation";
import { contentApiSchema } from "@/schema/content.schema";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const POST = withHandler(
    async ({ req }): Promise<NextResponse> => {
        const contentLength = Number(req.headers.get("content-length") || 0);

        if (contentLength > 6 * 1024 * 1024) {
            return err(
                "Payload too large",
                413
            );
        }

        const contentType = req.headers.get("content-type") || "";

        if (!contentType.includes("multipart/form-data")) {
            return err("Invalid content type", 415);
        }

        const formData = await req.formData();

        const type = sanitizeString(String(formData.get("type") || ""), 120);
        const title = sanitizeString(String(formData.get("title") || ""), 120);
        const description = sanitizeString(String(formData.get("description") || ""), 1000);
        const link_url = sanitizeString(String(formData.get("link_url") || ""), 200);
        const priority = Number(formData.get("priority") || 0);
        const folder = sanitizeString(String(formData.get("folder") || "categories"), 50);
        const file = formData.get("file") as File | null;

        // IMAGE REQUIRED
        if (!file || file.size <= 0) {
            return err(
                "Category image required",
                400
            );
        }

        // FILE SIZE
        if (file.size > MAX_FILE_SIZE) {
            return err(
                "Image too large",
                400
            );
        }

        // MIME VALIDATION
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return err(
                "Invalid image type",
                400
            );
        }

        // UPLOAD IMAGE
        let uploadedImage: {
            url: string;
            public_id: string;
        };

        try {
            uploadedImage = await uploadToCloudinary(file, folder);
        } catch (uploadError) {
            console.error("[CATEGORY_IMAGE_UPLOAD_ERROR]", uploadError);

            throw new ApiError(
                "Image upload failed",
                500
            );
        }

        // VALIDATION
        const parsed = contentApiSchema.safeParse(
            {
                type,
                title,
                description,
                link_url,
                image: uploadedImage,
                priority,
            }
        );

        if (parsed.success === false) {
            return err(
                "Validation failed",
                400
            );
        }

        // TRANSACTION
        const content = await withTransaction(
            async (client): Promise<AdminContentDTO> => {
                // DUPLICATE CHECK
                const existing = await getAdminContents({ title: parsed.data.title, type: parsed.data.type });

                if (existing.length > 0 && existing[0].title === parsed.data.title) {
                    throw new ApiError(
                        "Content already exists",
                        409
                    );
                }

                // INSERT
                return createContent(client, parsed.data);

            }
        )

        const response = ok({
            message: "Content created successfully",
            data: content
        }, 201)

        response.headers.set(
        "Cache-Control",
        "private, no-store"
      );

      return response;

    }, { access: "admin" }
)

export const GET = withHandler(
    async (): Promise<NextResponse> => {
        const contents = await getAdminContents();

        const response = okList(contents, {});

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "admin" }
)