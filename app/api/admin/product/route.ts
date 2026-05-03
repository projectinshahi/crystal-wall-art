import { err, ok, okList, withHandler } from "@/lib/api/handler";
import { uploadBase64ToCloudinary } from "@/lib/cloudinary.service";
import { withTransaction } from "@/lib/db";
import { AdminProductDTO } from "@/lib/db/dto/products.dto";
import { createProduct, getAdminProducts, insertProductImages, insertProductVariants } from "@/lib/db/repositories/admin/products.admin.repository";
import { NextResponse } from "next/server";

export const POST = withHandler(
    async ({ req }): Promise<NextResponse> => {

        const { product_details, product_variants } = await req.json();

        if (!product_details) return err("Invalid payload", 400);

        // ── 1. Basic validation ─────────────────────────────────────
        const requiredFields = ["title", "category", "price", "stock_quantity", "status"];

        for (const field of requiredFields) {
            if (
                product_details[field] === undefined ||
                product_details[field] === null ||
                product_details[field] === ""
            ) {
                return err(`Missing required field: ${field}`, 400);
            }
        }

        if (!Array.isArray(product_details.images) || product_details.images.length === 0) {
            return err(`At least one product image is required.`, 400);
        }

        const uploadedImages = await Promise.all(
            product_details.images.map(async (img: any, index: number) => {
                try {
                    // support both base64 + already uploaded
                    if (img.url) return img;
                    return await uploadBase64ToCloudinary(
                        img,
                        "product_images"
                    );
                } catch (error) {
                    return err(`Image ${index + 1} upload failed: ${(error as Error).message}`, 400);
                }
            })
        );

        const imageUrls: string[] = uploadedImages.map((img) => img);

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
            category: category,
            price: Number(rest.price),
            discount_price: rest.discount_price
                ? Number(rest.discount_price)
                : null,
            stock_quantity: Number(rest.stock_quantity),
            thumbnail: thumbnailUrl,
        };

        const product = await withTransaction(
            async (client): Promise<AdminProductDTO> => {

                const insertedProduct = await createProduct(client, productPayload);

                if (!insertedProduct || !insertedProduct.id) {
                    throw new Error("Product creation failed");
                }

                const productId = insertedProduct.id;

                await insertProductImages(client, productId, uploadedImages);

                if (Array.isArray(product_variants) && product_variants.length > 0) {
                    const cleanVariants = product_variants.map((v: any) => ({
                        product_id: productId,
                        size: v.size || null,
                        thickness: v.thickness || null,
                        price: Number(v.price),
                        discount_price: v.discount_price
                            ? Number(v.discount_price)
                            : null,
                        orientation: v.orientation,
                        stock_quantity: Number(v.stock_quantity) || 0,
                    }));

                    await insertProductVariants(client, cleanVariants);
                }

                return insertedProduct;
            }
        )

        const response = ok({
            message: "Product created successfully",
            data: {
                productId: product.id,
                images: imageUrls,
                thumbnail: thumbnailUrl,
            }
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
        const products = await getAdminProducts({ page: 1, limit: 20 });
        console.log("products",products);
        

        const response = okList(
            products.data,
            {
                pagination: products.pagination,
            }
        );

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "admin" }
)