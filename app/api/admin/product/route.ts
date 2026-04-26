import { uploadBase64ToCloudinary } from "@/lib/cloudinary.service";
import {
    addProductImages,
    addProducts,
    addProductVariants,
} from "@/lib/db/product.db";
import { requireAdmin } from "@/lib/session";

export async function POST(req: Request) {
    await requireAdmin();

    try {
        const { product_details, product_variants } = await req.json();

        if (!product_details) {
            return Response.json(
                { success: false, error: "Invalid payload" },
                { status: 400 }
            );
        }

        // ── 1. Basic validation ─────────────────────────────────────
        const requiredFields = ["title", "category", "price", "stock_quantity", "status"];

        for (const field of requiredFields) {
            if (
                product_details[field] === undefined ||
                product_details[field] === null ||
                product_details[field] === ""
            ) {
                return Response.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        if (!Array.isArray(product_details.images) || product_details.images.length === 0) {
            return Response.json(
                { success: false, error: "At least one product image is required." },
                { status: 400 }
            );
        }

        // ── 2. Upload images ───────────────────────────────────────
        const uploadedImages = await Promise.all(
            product_details.images.map(async (img: any, index: number) => {
                try {
                    // support both base64 + already uploaded
                    if (img.url) return img;
                    return await uploadBase64ToCloudinary(
                        img,
                        "product_images"
                    );
                } catch (err) {
                    throw new Error(`Image ${index + 1} upload failed: ${(err as Error).message}`);
                }
            })
        );

        const imageUrls: string[] = uploadedImages.map((img) => img.url);

        // ── 3. Resolve thumbnail ───────────────────────────────────
        let thumbnailUrl = imageUrls[0]; // fallback

        if (product_details.thumbnail) {
            const match = uploadedImages.find(
                (img) =>
                    img.url === product_details.thumbnail ||
                    img.previewUrl === product_details.thumbnail
            );

            if (match) {
                thumbnailUrl = match.url;
            }
        }

        // ── 4. Clean product payload ───────────────────────────────
        const { images, thumbnail, category, ...rest } = product_details;

        const productPayload = {
            ...rest,
            category_id: category,
            price: Number(rest.price),
            discount_price: rest.discount_price
                ? Number(rest.discount_price)
                : null,
            stock_quantity: Number(rest.stock_quantity),
            thumbnail: thumbnailUrl,
        };

        // ── 5. Insert product ──────────────────────────────────────
        const { data: productData, error: productError } = await addProducts(productPayload);

        if (productError || !productData) {
            throw new Error(productError?.message || "Product creation failed");
        }

        // 🔥 Handle both object and array return
        const productId: string = Array.isArray(productData)
            ? productData[0]?.id
            : productData.id;

        if (!productId) {
            throw new Error("Invalid product ID returned");
        }

        // ── 6. Insert images ───────────────────────────────────────
        const { error: imageError } = await addProductImages({ productId, imageUrls });

        if (imageError) {
            throw new Error(imageError || "Image insert failed")
        }

        // ── 7. Insert variants ─────────────────────────────────────
        if (Array.isArray(product_variants) && product_variants.length > 0) {
            const cleanVariants = product_variants.map((v: any) => ({
                product_id: productId,
                size: v.size || null,
                thickness: v.thickness || null,
                price: Number(v.price),
                discount_price: v.discount_price
                    ? Number(v.discount_price)
                    : null,
                stock_quantity: Number(v.stock_quantity) || 0,
            }));

            const { error: variantError } = await addProductVariants(cleanVariants);

            if (variantError) {
                throw new Error(variantError || "Variant insert failed")
            }
        }

        // ── 8. Success response ────────────────────────────────────
        return Response.json({
            success: true,
            data: {
                productId,
                images: imageUrls,
                thumbnail: thumbnailUrl,
            },
        });

    } catch (error: any) {
        console.error("❌ PRODUCT CREATE ERROR:", error);

        return Response.json(
            {
                success: false,
                message: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}