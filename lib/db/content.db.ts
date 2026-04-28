import { ContentFormInput } from "@/types/Admin/content.types";
import { supabaseServer } from "../supabase/server";

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