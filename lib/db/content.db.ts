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

export const getContents = async ({ page, limit }: { page: number, limit: number }): Promise<DBResponse<any[], PaginationMeta>> => {
    try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabaseServer
            .from('contents')
            .select('*', { count: 'exact' })
            .eq('deleted', false)
            .order('created_at', { ascending: false })
            .range(from, to);
        console.log("data", data);

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