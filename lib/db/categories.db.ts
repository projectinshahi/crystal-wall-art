import { DBResponse } from "@/types/dbResponse.types";
import { supabaseServer } from "../supabase/server";
import { CategoryTypes } from "@/types/Admin/categories.types";

export const getAllCategories = async ():Promise<DBResponse<CategoryTypes[]>> => {
  try {
    const { data, error } = await supabaseServer.from('categories').select('*').neq("deleted", "TRUE").order("title", { ascending: true });;

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