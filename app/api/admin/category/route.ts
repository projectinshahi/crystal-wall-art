import { uploadToCloudinary } from "@/lib/cloudinary.service";
import { getAllCategories } from "@/lib/db/categories.db";
import { requireAdmin, requireAuth } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase/server";
import { categoryApiSchema, categorySchema } from "@/schema/category.schema";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = Number(formData.get("priority"));
    const is_active = formData.get("is_active") === "true";

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "categories";

    let finalImage: { url: string; public_id: string } | null = null;

    // ✅ Upload image directly (NO API CALL)
    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, folder);
      finalImage = uploaded;
    }

    if (!finalImage?.url) {
      return Response.json(
        { success: false, message: "Category image is required" },
        { status: 400 }
      );
    }

    // ✅ Validate
    const parsed = categoryApiSchema.safeParse({
      title,
      description,
      priority,
      is_active,
      image_url: finalImage,
    });

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // ✅ Insert
    const { data, error } = await supabaseServer
      .from("categories")
      .insert([parsed.data])
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Insert failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Category created successfully",
      data,
    });

  } catch (err: any) {
    console.error("POST /categories error:", err);

    return Response.json(
      {
        success: false,
        message: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAuth();

    const { data, error } = await getAllCategories();

    if (error) throw new Error();

    return Response.json({ data });
  } catch {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
}