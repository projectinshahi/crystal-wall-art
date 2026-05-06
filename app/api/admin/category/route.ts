import { ApiError } from "@/lib/api/errors";
import { err, ok, okList, withHandler } from "@/lib/api/handler";
import { uploadToCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { AdminCategoryDTO } from "@/lib/db/dto/category.dto";
import { createCategory, getAdminCategories } from "@/lib/db/repositories/admin/category.admin.repository";
import { sanitizeString } from "@/lib/validation";
import { categoryApiSchema } from "@/schema/category.schema";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const POST =
  withHandler(
    async ({
      req,
    }): Promise<NextResponse> => {
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

      const title = sanitizeString(String(formData.get("title") || ""), 120);

      const description = sanitizeString(String(formData.get("description") || ""), 1000);

      const priority = Number(formData.get("priority") || 0);

      const is_active = formData.get("is_active") === "true";

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
      } catch (
      uploadError
      ) {
        console.error("[CATEGORY_IMAGE_UPLOAD_ERROR]", uploadError);

        throw new ApiError(
          "Image upload failed",
          500
        );
      }

      // VALIDATION
      const parsed = categoryApiSchema.safeParse(
        {
          title,
          description,
          priority,
          is_active,
          image_url: uploadedImage
        }
      );

      if (parsed.success === false) {
        return err(
          "Validation failed",
          400
        );
      }

      // TRANSACTION
      const category =
        await withTransaction(
          async (
            client
          ): Promise<AdminCategoryDTO> => {
            // DUPLICATE CHECK
            const existing =
              await getAdminCategories(
                {
                  title:
                    parsed.data
                      .title,
                }
              );

            if (existing.length > 0 && existing[0].title === parsed.data.title) {
              throw new ApiError(
                "Category already exists",
                409
              );
            }

            // INSERT
            return createCategory(client, parsed.data);
          }
        );

      const response = ok(
        {
          message:
            "Category created successfully",

          data: category,
        },
        201
      );

      response.headers.set(
        "Cache-Control",
        "private, no-store"
      );

      return response;
    },
    {
      access: "admin",
    }
  );

export const GET =
  withHandler(
    async (): Promise<NextResponse> => {
      const categories =
        await getAdminCategories();

      const response =
        okList(
          categories,
          {}
        );

      response.headers.set(
        "Cache-Control",
        "private, no-store"
      );

      return response;
    },
    {
      access: "admin",
    }
  );