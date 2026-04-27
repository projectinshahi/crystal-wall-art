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
                meta: null,
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
                meta: null,
            };
        }

        return {
            success: true,
            data: null,
            error: null,
            meta: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
            meta: null,
        };
    }
};

type ProductVariant = {
    product_id: string;
    size: string | null;
    thickness: string | null;
    price: number;
    discount_price: number | null;
    orientation: string;
    stock_quantity: number;
};

export const addProductVariants = async (variants: ProductVariant[]): Promise<DBResponse<null>> => {
    try {
        if (!variants.length) {
            return {
                success: true,
                data: null,
                error: null,
                meta: null
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
                meta: null
            };
        }

        return {
            success: true,
            data: null,
            error: null,
            meta: null
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
            meta: null
        };
    }
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const getProducts = async ({ page, limit }: { page: number, limit: number }): Promise<DBResponse<any[], PaginationMeta>> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabaseServer
            .from('products')
            .select('*', { count: 'exact' })
            .eq('deleted', false)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            return {
                success: false,
                data: null,
                error: error.message,
                meta: null,
            };
        }

        return {
            success: true,
            data: data || [],
            error: null,
            meta: {
                page,
                limit,
                total: count || 0,
                totalPages: count ? Math.ceil(count / limit) : 0,
            },
        };

    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
            meta: null
        };
    }
}