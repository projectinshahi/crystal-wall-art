import { ProductFormValues } from "@/schema/product.schema";
import { supabaseServer } from "../supabase/server";
import { DBResponse } from "@/types/dbResponse.types";

export const addProducts = async (productData: ProductFormValues) => {
    
    try {
        const { data, error } = await supabaseServer.from('products').insert(productData)
            .select('id').maybeSingle();

        if (error) {
            console.error("Supabase error:", error.message);
            return {
                success: false,
                data: null,
                error: error.message,
            };
        }

        return {
            success: true,
            data,
            error: null,
        };

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
        };
    }
}

export const addProductImages = async ({ productId, imageUrls }: { productId: string; imageUrls: string[]; }): Promise<DBResponse<null>> => {
    try {
        if (!imageUrls.length) {
            return {
                success: false,
                data: null,
                error: "No images provided",
            };
        }

        const payload = imageUrls.map((url, index) => ({
            product_id: productId,
            image_url: url
        }));

        const { error } = await supabaseServer
            .from("product_images")
            .insert(payload);

        if (error) {
            return {
                success: false,
                data: null,
                error: error.message,
            };
        }

        return {
            success: true,
            data: null,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
        };
    }
};

type ProductVariant = {
    product_id: string;
    size: string | null;
    thickness: string | null;
    price: number;
    discount_price: number | null;
    stock_quantity: number;
};

export const addProductVariants = async (variants: ProductVariant[]): Promise<DBResponse<null>> => {
    try {
        if (!variants.length) {
            return {
                success: true,
                data: null,
                error: null,
            };
        }

        const { error } = await supabaseServer
            .from("product_variants")
            .insert(variants);

        if (error) {
            return {
                success: false,
                data: null,
                error: error.message,
            };
        }

        return {
            success: true,
            data: null,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
        };
    }
};