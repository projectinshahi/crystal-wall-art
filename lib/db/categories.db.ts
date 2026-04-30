import { DBResponse } from "@/types/dbResponse.types";
import { supabaseServer } from "../supabase/server";
import { CategoryTypes } from "@/types/Admin/categories.types";

export const getAllCategories = async ({ is_active }: { is_active?: boolean }): Promise<DBResponse<CategoryTypes[]>> => {
  try {
    let query = supabaseServer
      .from("categories")
      .select("*", { count: "exact" })
      .eq("deleted", false)

    if (is_active !== undefined) {
      query = query.eq("is_active", is_active);
    }

    const { data, error } = await query.order("title", {
      ascending: true,
    });

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
      data: data ?? [],
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

export const getCategoryById = async ({id, is_active}:{id: string, is_active?: boolean}): Promise<DBResponse<CategoryTypes>>=>{
  try {
    let query = supabaseServer
      .from("categories")
      .select("*", { count: "exact" })
      .eq("id", id)
      .eq("deleted", false)

    if (is_active !== undefined) {
      query = query.eq("is_active", is_active);
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
      meta: null
    };
  } catch (error:any) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      data: null,
      error: error?.message || "Unknown error",
      meta: null
    };
  }
}