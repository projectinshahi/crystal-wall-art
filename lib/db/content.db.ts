import { ContentFormInput } from "@/types/Admin/content.types";
import { supabaseServer } from "../supabase/server";
import { DBResponse } from "@/types/dbResponse.types";
import { PaginationMeta } from "./product.db";

export const addContent = async (formData: ContentFormInput) => {
    console.log("formData", formData);

    try {
        const { data, error } = await supabaseServer
            .from('contents')
            .insert([formData])
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error.message);
            return {
                success: false,
                data: null,
                error: error.message,
                meta: null
            };
        }

        return {
            success: true,
            data,
            error: null,
            meta: null
        };
    } catch (error: any) {
        console.error("Unexpected error:", error);
        return {
            success: false,
            data: null,
            error: error?.message || "Unknown error",
            meta: null
        };
    }
}

export const getContents = async ({ page, limit, type, is_active }: { page?: number, limit?: number, type?: string, is_active?: boolean }): Promise<DBResponse<any[], PaginationMeta>> => {
    try {
        let query = supabaseServer
            .from("contents")
            .select("*", { count: "exact" })
            .eq("deleted", false);

        // Filters
        if (type) {
            query = query.eq("type", type);
        }

        if (is_active !== undefined) {
            query = query.eq("is_active", is_active);
        }

        // Apply pagination ONLY if both exist
        let meta: PaginationMeta | null = null;

        if (page !== undefined && limit !== undefined) {
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

        const { data, error, count } = await query.order("created_at", {
            ascending: false,
        });

        if (error) {
            return {
                success: false,
                data: null,
                error: error.message,
                meta: null,
            };
        }

        // Update meta only if pagination used
        if (meta) {
            meta.total = count ?? 0;
            meta.totalPages = count ? Math.ceil(count / meta.limit) : 0;
        }

        return {
            success: true,
            data: data ?? [],
            error: null,
            meta,
        };
    } catch (err: any) {
        return {
            success: false,
            data: null,
            error: err?.message || "Unknown error",
            meta: null,
        };
    }
}

export const toogleContentStatus = async ({ id, is_active }: { id: string, is_active: boolean }) => {
    try {
        const { data, error } = await supabaseServer
            .from("contents")
            .update({ is_active })
            .eq("id", id)
            .select()
            .single();

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
            data: data,
            error: null,
            meta: null,
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

export const deleteContent = async ({ id }: { id: string }) => {
    try {
        const { data, error } = await supabaseServer
            .from("contents")
            .update({
                deleted: true,
                is_active: false,
            })
            .eq("id", id)
            .select()
            .single();

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
            data: data,
            error: null,
            meta: null,
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