import { supabaseServer } from "../supabase/server";

export const getAdminRole = async () => {
  try {

    const { data, error } = await supabaseServer.from('roles').select('*').eq("name", "admin")

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