import { err, ok, withHandler } from "@/lib/api/handler";
import { getAdminProductById, getAdminProducts, updateProductStatus } from "@/lib/db/repositories/admin/products.admin.repository";
import { uploadBase64ToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { isSubcategory } from "@/lib/db/repositories/admin/category.admin.repository";
import { discardImages, resolveSizeImages, SizeImages, unusedSizeImages } from "@/lib/productSizeImages";
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

    // Products belong to a subcategory, never directly to a main category (checked before any upload)
    if (!(await isSubcategory(product_details.category))) {
      return err("Select a subcategory — products can't be added directly to a main category", 400);
    }

    // ── Size images (optional, one per size) — resolved before the gallery is touched
    const existingSizeImages: SizeImages = existing.size_images ?? {};
    let sizeImages: SizeImages;
    let uploadedSizeImages: string[];
    try {
      ({ sizeImages, uploaded: uploadedSizeImages } = await resolveSizeImages(product_details.size_images, product_details.sizes, existingSizeImages));
    } catch (error) {
      return err(`Size image upload failed: ${(error as Error).message}`, 400);
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
          await discardImages(uploadedSizeImages);
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
            size_images = $13,
            updated_at = NOW()
          WHERE id = $14
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
          sizeImages,
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

        // Handle variants: rows the form already had are updated in place (keeping their ids, so carts and
        // past orders stay linked), new rows are inserted, and only the rows the admin removed are deleted
        if (Array.isArray(product_variants) && product_variants.length > 0) {
          const existingIds = new Set<string>(
            (await client.query(`SELECT id FROM product_variants WHERE product_id = $1`, [productId])).rows.map((r) => r.id)
          );
          const keptIds = new Set<string>();

          const rows = product_variants.map((v: any) => {
            const keep = existingIds.has(v.id) && !keptIds.has(v.id);
            if (keep) keptIds.add(v.id);
            return {
              id: keep ? v.id : null,
              size: v.size || null,
              thickness: v.thickness || null,
              mounting_method: v.mounting_method || null,
              price: v.price,
              discount_price: v.discount_price || null,
              orientation: v.orientation,
              stock_quantity: v.stock_quantity || 0,
            };
          });

          await client.query(
            `DELETE FROM product_variants WHERE product_id = $1 AND id <> ALL($2::uuid[])`,
            [productId, [...keptIds]]
          );

          const variantRows = `jsonb_to_recordset($2::jsonb) AS v(id uuid, size text, thickness text, mounting_method text, price numeric, discount_price numeric, orientation text, stock_quantity integer)`;

          await client.query(`
            UPDATE product_variants pv
            SET size = v.size, thickness = v.thickness, mounting_method = v.mounting_method, price = v.price,
                discount_price = v.discount_price, orientation = v.orientation, stock_quantity = v.stock_quantity
            FROM ${variantRows}
            WHERE pv.id = v.id AND pv.product_id = $1
          `, [productId, JSON.stringify(rows.filter((r) => r.id))]);

          await client.query(`
            INSERT INTO product_variants (product_id, size, thickness, mounting_method, price, discount_price, orientation, stock_quantity)
            SELECT $1, v.size, v.thickness, v.mounting_method, v.price, v.discount_price, v.orientation, v.stock_quantity
            FROM ${variantRows}
          `, [productId, JSON.stringify(rows.filter((r) => !r.id))]);
        }

        // Fetch and return updated product with all relations
        return getAdminProductById(productId);
      });

      // Remove size images that were replaced or removed, now that the row no longer uses them
      await discardImages(unusedSizeImages(existingSizeImages, sizeImages));

      const response = ok({
        message: "Product updated successfully",
        data: updated,
        success: true,
      });

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    } catch (error) {
      console.error("[PUT product] Update failed:", error);
      await discardImages(uploadedSizeImages);
      // cart_items → product_variants is ON DELETE RESTRICT
      if ((error as { constraint?: string }).constraint === "cart_items_variant_id_fkey") {
        return err("A price variant you removed is in a customer's cart, so it can't be deleted yet. Keep that variant and try again.", 409);
      }
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