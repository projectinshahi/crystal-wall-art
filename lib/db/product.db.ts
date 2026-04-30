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

export const addProductImages = async ({ productId, imageUrls }: { productId: string; imageUrls: any[]; }): Promise<DBResponse<null>> => {
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

export const getProducts = async ({ page, limit, category, is_active }: { page?: number, limit?: number, category?: string, is_active?: boolean }): Promise<DBResponse<any[], PaginationMeta>> => {
    try {
        let query = supabaseServer
            .from("products")
            .select("*", { count: "exact" })
            .eq("deleted", false);

        // ✅ safer checks
        if (is_active !== undefined) {
            query = query.eq("status", is_active ? "active" : "inactive");
        }

        if (category && category.trim() !== "") {
            query = query.eq("category_id", category);
        }

        query = query.order("created_at", { ascending: false });

        let meta = null;

        if (page && limit) {
            const safePage = Math.max(page, 1);
            const safeLimit = Math.min(Math.max(limit, 1), 50);

            const from = (safePage - 1) * safeLimit;
            const to = from + safeLimit - 1;

            query = query.range(from, to);

            meta = {
                page: safePage,
                limit: safeLimit,
                total: 0,
                totalPages: 0,
            };
        }

        const { data, error, count } = await query;

        if (error) {
            return {
                success: false,
                data: null,
                error: error.message,
                meta: null,
            };
        }

        if (meta) {
            meta.total = count ?? 0;
            meta.totalPages = count
                ? Math.ceil(count / meta.limit)
                : 0;
        }

        return {
            success: true,
            data: data ?? [],
            error: null,
            meta,
        };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
            meta: null,
        };
    }
}

export const getProductById = async ({ id, is_active }: { id: string, is_active?: boolean }) => {
    try {

        let query = supabaseServer
            .from("products")
            .select("*", { count: "exact" })
            .eq("deleted", false);

        // ✅ safer checks
        if (is_active !== undefined) {
            query = query.eq("status", is_active ? "active" : "inactive");
        }

        const { data, error } = await query.maybeSingle();

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
            data: data || null,
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
}

export const getVariantsByProducts = async ({ id }: { id: string }) => {
    try {
        const { data, error } = await supabaseServer
            .from("product_variants")
            .select("*")
            .eq("product_id", id);

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
            data: data || null,
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
}