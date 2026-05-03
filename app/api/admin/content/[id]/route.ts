import { ApiError } from "@/lib/api/errors";
import { err, ok, withHandler } from "@/lib/api/handler";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { toogleContentStatus } from "@/lib/db/content.db";
import { getAdminContents, softDeleteContent, updateContent, updateContentStatus } from "@/lib/db/repositories/admin/content.admin.repository";
import { requireAdmin } from "@/lib/session";
import { sanitizeString } from "@/lib/validation";
import { contentApiSchema } from "@/schema/content.schema";
import { ContentFormInput } from "@/types/Admin/content.types";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const PUT = withHandler(
    async ({ req, params }): Promise<NextResponse> => {
        const routeParams = await params;

        const contentId = routeParams?.id;

        if (!contentId) {
            return err(
                "Content ID is required",
                400
            );
        }

        // Validate content type
        const contentType = req.headers.get("content-type") || "";

        if (!contentType.includes("multipart/form-data")) {
            return err(
                "Invalid content type",
                415
            );
        }

        const formData = await req.formData();

        // Sanitize inputs
        const type = sanitizeString(String(formData.get("type") || ""), 120);
        const title = sanitizeString(String(formData.get("title") || ""), 120);
        const description = sanitizeString(String(formData.get("description") || ""), 1000);
        const link_url = sanitizeString(String(formData.get("link_url") || ""), 200);
        const priority = Number(formData.get("priority") || 0);
        const folder = sanitizeString(String(formData.get("folder") || "categories"), 50);
        const file = formData.get("file") as File | null;

        const existing: any = await getAdminContents({ id: contentId });

        if (!existing) {
            return err(
                "Content not found",
                404
            );
        }

        if (existing.deleted === true) {
            return err(
                "Deleted category cannot be updated",
                409
            );
        }

        // DEFAULT TO EXISTING IMAGE
        let image_url = existing.image;

        // NEW IMAGE UPLOAD
        if (file && file.size > 0) {
            if (file.size > MAX_FILE_SIZE) {
                return err(
                    "Image size exceeds 5MB limit",
                    400
                );
            }

            // MIME TYPE VALIDATION
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                return err(
                    "Invalid image type",
                    400
                );
            }

            try {

                // UPLOAD NEW IMAGE
                const uploaded = await uploadToCloudinary(file, folder);

                image_url = {
                    url: uploaded.url,
                    public_id: uploaded.public_id,
                };

                // DELETE OLD IMAGE
                try {

                    const oldImage = typeof existing.image_url === "string"
                        ? JSON.parse(existing.image_url)
                        : existing.image_url;

                    if (oldImage?.public_id) {
                        await deleteFromCloudinary(oldImage.public_id);
                    }

                } catch (cloudinaryDeleteError) {
                    console.warn(
                        "[CLOUDINARY_DELETE_FAILED]",
                        cloudinaryDeleteError
                    );
                }

            } catch (uploadError) {
                console.error(
                    "[CATEGORY_UPLOAD_ERROR]",
                    uploadError
                );

                throw new ApiError(
                    "Image upload failed",
                    500
                );
            }
        }

        // VALIDATION
        const parsed = contentApiSchema.safeParse(
            {
                type,
                title,
                description,
                link_url,
                image: image_url,
                priority,
            }
        );

        if (parsed.success === false) {
            return err(
                "Validation failed",
                400
            );
        }

        // UPDATE CONTENT
        const updatedContent = await updateContent(
            contentId,
            parsed.data as ContentFormInput
        )

        const response = ok({
            message: "Content updated successfully",
            data: updatedContent
        })

        // Never Cache Admin APIs
        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;

    }
)

export const PATCH = withHandler(
    async ({ req, params }): Promise<NextResponse> => {
        const routeParams = await params;

        const contentId = routeParams?.id;

        if (!contentId) {
            return err(
                "Content ID is required",
                400
            );
        }

        const body = await req.json();

        const { is_active } = body;

        if (typeof is_active !== "boolean") {
            return err(
                "is_active must be boolean",
                400
            );
        }

        // CHECK EXISTS
        const existing = await getAdminContents({ id: contentId });

        if (!existing) {
            return err(
                "Content not found",
                404
            );
        }

        // UPDATE
        const updated = await updateContentStatus(contentId, is_active);

        return ok({
            message: `Content ${is_active ? "activated" : "deactivated"
                } successfully`,
            data: updated,
        })

    }
)

export const DELETE = withHandler(
    async ({ params }): Promise<NextResponse> => {
        const routeParams = await params;

        // GET ID
        const contentId = routeParams?.id;

        if (!contentId) {
            return err(
                "Content ID is required",
                400
            );
        }

        // TRANSACTION
        const deleteContent = await withTransaction(
            async (client) => {
                // CHECK CATEGORY EXISTS
                const existing: any = await getAdminContents({ id: contentId });

                if (!existing) {
                    throw new ApiError(
                        "Content not found",
                        404
                    );
                }

                // ALREADY DELETED
                if (existing.deleted === true) {
                    throw new ApiError(
                        "Content already deleted",
                        409
                    );
                }

                // SOFT DELETE
                return softDeleteContent(client, contentId);
            }
        )

        const response = ok({
            message: `Content moved to trash successfully`,
            data: deleteContent,
        })

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;

    }
)