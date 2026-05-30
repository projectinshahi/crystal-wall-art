import { ApiError } from "@/lib/api/errors";
import { err, ok, withHandler } from "@/lib/api/handler";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { getAdminCategories, softDeleteCategory, updateCategory, updateCategoryStatus } from "@/lib/db/repositories/admin/category.admin.repository";
import { sanitizeString } from "@/lib/validation";
import { CategoryApiInput, categoryApiSchema } from "@/schema/category.schema";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const PUT = withHandler(
  async ({
    req,
    params,
  }): Promise<NextResponse> => {

    // RESOLVE PARAMS
    const routeParams =
      await params;

    const categoryId =
      routeParams?.id;

    // VALIDATE ID
    if (!categoryId) {
      return err(
        "Category ID is required",
        400
      );
    }

    // VALIDATE CONTENT TYPE
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return err(
        "Invalid content type",
        415
      );
    }

    // PARSE FORM DATA
    const formData = await req.formData();

    // SANITIZE INPUTS
    const title = sanitizeString(String(formData.get("title") || ""), 120);

    const description = sanitizeString(String(formData.get("description") || ""), 1000);

    const priority = Number(formData.get("priority") || 0);

    const is_active = formData.get("is_active") === "true";

    const folder = sanitizeString(String(formData.get("folder") || "categories"), 50);

    const file = formData.get("file") as File | null;

    // GET EXISTING CATEGORY
    const existing: any = await getAdminCategories({ id: categoryId });

    if (!existing) {
      return err(
        "Category not found",
        404
      );
    }

    // BLOCK DELETED CATEGORY
    if (existing.deleted === true) {
      return err(
        "Deleted category cannot be updated",
        409
      );
    }

    // DEFAULT TO EXISTING IMAGE
    let image_url = JSON.parse(existing[0].image_url)

    // NEW IMAGE UPLOAD
    if (file && file.size > 0) {

      // FILE SIZE VALIDATION
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

    // VALIDATE PAYLOAD
    const parsed = categoryApiSchema.safeParse({
      title,
      description,
      priority,
      is_active,
      image_url,
    });

    if (parsed.success === false) {
      return err(
        "Validation failed",
        400
      );
    }

    // UPDATE CATEGORY
    const updatedCategory = await updateCategory(
      categoryId,
      parsed.data as CategoryApiInput
    );

    const response = ok({
      message: "Category updated successfully",
      data: updatedCategory,
    });

    // NEVER CACHE ADMIN APIs
    response.headers.set(
      "Cache-Control",
      "private, no-store"
    );

    return response;
  },
  {
    access: "admin",
    rateLimit: {
      max: 20,
      windowMs: 60 * 1000,
    },
  }
);

export const PATCH = withHandler(
  async ({ req, params }): Promise<NextResponse> => {

    const routeParams = await params;

    const categoryId = routeParams?.id;

    if (!categoryId) {
      return err(
        "Category ID is required",
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
    const existing = await getAdminCategories({ id: categoryId });

    if (!existing) {
      return err(
        "Category not found",
        404
      );
    }

    // UPDATE
    const updated = await updateCategoryStatus(categoryId, is_active);

    return ok({
      message: `Category ${is_active
        ? "activated"
        : "deactivated"
        } successfully`,

      data: updated,
    });
  },
  {
    access: "admin",
  }
);

export const DELETE = withHandler(
  async (
    { params }
  ): Promise<NextResponse> => {

    const routeParams = await params;

    // GET ID
    const categoryId = routeParams?.id;

    if (!categoryId) {
      return err(
        "Category ID is required",
        400
      );
    }

    // TRANSACTION
    const deletedCategory =
      await withTransaction(
        async (client) => {

          // CHECK CATEGORY EXISTS
          const existing: any = await getAdminCategories({ id: categoryId });

          if (!existing) {
            throw new ApiError(
              "Category not found",
              404
            );
          }

          // ALREADY DELETED
          if (
            existing.deleted === true
          ) {
            throw new ApiError(
              "Category already deleted",
              409
            );
          }

          // SOFT DELETE
          return softDeleteCategory(
            client,
            categoryId
          );
        }
      );

    const response = ok({
      message:
        "Category moved to trash",

      data: deletedCategory,
    });

    // NEVER CACHE ADMIN APIs
    response.headers.set(
      "Cache-Control",
      "private, no-store"
    );

    return response;
  },
  {
    access: "admin",

    rateLimit: {
      max: 20,
      windowMs: 60 * 1000,
    },
  }
);