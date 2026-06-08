import { err, ok, withHandler } from "@/lib/api/handler";
import { getAdminProductById, getAdminProducts, updateProductStatus } from "@/lib/db/repositories/admin/products.admin.repository";
import { uploadBase64ToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = withHandler(
  async ({ params }): Promise<NextResponse> => {
    const routeParams = await params;
    const productId = routeParams?.id;

    if (!productId) {
      return err("Product ID is required", 400);
    }

    const product = await getAdminProductById(productId);

    if (!product) {
      return err("Product not found", 404);
    }

    const response = ok({ message: "Product found", data: product });
    response.headers.set("Cache-Control", "private, no-store");

    return response;
  },
  { access: "admin" }
);

export const PUT = withHandler(
  async ({ req, params }): Promise<NextResponse> => {
    const routeParams = await params;
    const productId = routeParams?.id;

    if (!productId) {
      return err("Product ID is required", 400);
    }

    const { product_details, product_variants } = await req.json();

    if (!product_details) return err("Invalid payload", 400);

    // ── 1. Fetch existing product ────────────────────────────────────────
    const existing = await getAdminProductById(productId);

    if (!existing) {
      return err("Product not found", 404);
    }

    // ── 2. Process images ────────────────────────────────────────────────
    const extractPublicIdFromUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        const segments = parsed.pathname.split("/").filter(Boolean);
        const filename = segments.pop() ?? "";
        const idWithoutExtension = filename.split(".")[0];
        const uploadIndex = segments.findIndex((segment) => segment === "upload");
        if (uploadIndex >= 0) {
          return [...segments.slice(uploadIndex + 1), idWithoutExtension].join("/");
        }
        return idWithoutExtension;
      } catch {
        return url.split("/").slice(-1)[0].split(".")[0];
      }
    };

    const normalizeImageObject = (value: any) => {
      if (!value) return null;

      if (typeof value === "object") {
        if (typeof value.url === "string") {
          return {
            url: value.url,
            public_id:
              typeof value.public_id === "string"
                ? value.public_id
                : undefined,
          };
        }

        if (typeof value.image_url === "string") {
          try {
            const parsed = JSON.parse(value.image_url);
            if (parsed && typeof parsed.url === "string") {
              return {
                url: parsed.url,
                public_id:
                  typeof parsed.public_id === "string"
                    ? parsed.public_id
                    : undefined,
              };
            }
          } catch {
            return { url: value.image_url, public_id: undefined };
          }
        }
      }

      if (typeof value === "string") {
        if (value.startsWith("data:")) return null;

        if (value.startsWith("https://")) {
          return {
            url: value,
            public_id: value.split("/").slice(-1)[0].split(".")[0],
          };
        }

        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed.url === "string") {
            return {
              url: parsed.url,
              public_id:
                typeof parsed.public_id === "string"
                  ? parsed.public_id
                  : undefined,
            };
          }
        } catch {
          // fall through
        }
      }

      return null;
    };

    const existingImages = (existing.images || [])
      .map((item: any) => normalizeImageObject(item.image_url))
      .filter(Boolean) as Array<{ url: string; public_id?: string }>;

    const existingImageMap = new Map(
      existingImages.map((image) => [image.url, image])
    );

    const productImages: Array<{ url: string; public_id?: string }> = [];

    if (product_details.images && Array.isArray(product_details.images)) {
      for (const img of product_details.images) {
        try {
          if (typeof img === "string" && img.startsWith("data:")) {
            const uploaded = await uploadBase64ToCloudinary(img, "product_images");
            productImages.push(uploaded);
            continue;
          }

          const normalized = normalizeImageObject(img);
          if (!normalized) continue;

          if (!normalized.public_id && existingImageMap.has(normalized.url)) {
            normalized.public_id = existingImageMap.get(normalized.url)?.public_id;
          }

          if (!normalized.public_id && normalized.url.startsWith("https://")) {
            normalized.public_id = extractPublicIdFromUrl(normalized.url);
          }

          productImages.push(normalized);
        } catch (error) {
          console.error("[PUT product] Image upload failed:", error);
          return err(`Image upload failed: ${(error as Error).message}`, 500);
        }
      }
    }

    // ── 3. Delete old images that are no longer in the product ───────────
    const newPublicIds = new Set(
      productImages
        .map((img) => img.public_id)
        .filter((id): id is string => Boolean(id))
    );

    for (const oldImage of existingImages) {
      if (oldImage.public_id && !newPublicIds.has(oldImage.public_id)) {
        try {
          await deleteFromCloudinary(oldImage.public_id);
        } catch (error) {
          console.warn("[PUT product] Failed to delete old image:", error);
        }
      }
    }

    // ── 4. Update in database ────────────────────────────────────────────
    try {
      const updated = await withTransaction(async (client) => {
        // Update main product fields
        const updateQuery = `
          UPDATE products
          SET
            title = $1,
            description = $2,
            price = $3,
            discount_price = $4,
            stock_quantity = $5,
            category_id = $6,
            status = $7,
            sizes = $8,
            thickness = $9,
            mounting_methods = $10,
            orientations = $11,
            thumbnail = $12,
            updated_at = NOW()
          WHERE id = $13
          RETURNING *
        `;

        const normalizedThumbnail = normalizeImageObject(product_details.thumbnail) ??
          (typeof product_details.thumbnail === "string" &&
          product_details.thumbnail.startsWith("https://")
            ? existingImageMap.get(product_details.thumbnail) ?? {
                url: product_details.thumbnail,
                public_id: extractPublicIdFromUrl(product_details.thumbnail),
              }
            : null);

        const thumbnailValue = normalizedThumbnail
          ? JSON.stringify(normalizedThumbnail)
          : product_details.thumbnail;

        const result = await client.query(updateQuery, [
          product_details.title,
          product_details.description,
          product_details.price,
          product_details.discount_price || null,
          product_details.stock_quantity,
          product_details.category,
          product_details.status,
          product_details.sizes || [],
          product_details.thickness || [],
          product_details.mounting_methods || [],
          product_details.orientation || [],
          thumbnailValue,
          productId,
        ]);

        const updatedProduct = result.rows[0];

        // Delete existing images and insert new ones
        await client.query(`DELETE FROM product_images WHERE product_id = $1`, [productId]);
        
        if (productImages.length > 0) {
          const imagePlaceholders = productImages.map((_, i) => `($1, $${i + 2})`).join(',');
          const imageQuery = `
            INSERT INTO product_images (product_id, image_url)
            VALUES ${imagePlaceholders}
          `;
          await client.query(
            imageQuery,
            [productId, ...productImages.map((img) => JSON.stringify(img))]
          );
        }

        // Handle variants
        if (Array.isArray(product_variants) && product_variants.length > 0) {
          // Delete existing variants
          await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [productId]);
          
          // Insert new variants
          const variantPlaceholders = product_variants.map((_, i) => {
            const baseIndex = i * 7;
            return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`;
          }).join(',');

          const variantValues: any[] = [];
          product_variants.forEach((v: any) => {
            variantValues.push(productId, v.size || null, v.thickness || null, v.price, v.discount_price || null, v.orientation, v.stock_quantity || 0);
          });

          const variantQuery = `
            INSERT INTO product_variants (product_id, size, thickness, price, discount_price, orientation, stock_quantity)
            VALUES ${variantPlaceholders}
          `;
          await client.query(variantQuery, variantValues);
        }

        // Fetch and return updated product with all relations
        return getAdminProductById(productId);
      });

      const response = ok({
        message: "Product updated successfully",
        data: updated,
        success: true,
      });

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    } catch (error) {
      console.error("[PUT product] Update failed:", error);
      return err(`Update failed: ${(error as Error).message}`, 500);
    }
  },
  { access: "admin" }
);

export const PATCH = withHandler(
  async ({ req, params }): Promise<NextResponse> => {

    const routeParams = await params;

    const productID = routeParams?.id;

    if (!productID) {
      return err(
        "Product ID is required",
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
    const existing = await getAdminProducts({ id: productID });

    if (!existing?.data?.length) {
      return err(
        "Product not found",
        404
      );
    }

    // UPDATE
    const updated = await updateProductStatus(productID, is_active);

    return ok({
      message: `Product ${is_active
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