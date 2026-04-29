import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary.service";
import { requireAdmin } from "@/lib/session";
import { supabaseServer } from "@/lib/supabase/server";
import { categorySchema } from "@/schema/category.schema";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    // ✅ Use formData to support file upload
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = Number(formData.get("priority"));
    const is_active = formData.get("is_active") === "true";

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "categories";

    let image_url: any = null;

    // 🔍 Get existing category
    const { data: existing, error: fetchError } = await supabaseServer
      .from("categories")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // ✅ Case 1: New file uploaded
    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, folder);

      image_url = {
        url: uploaded.url,
        public_id: uploaded.public_id,
      };

      // 🧹 Delete old image
      if (existing.image_url?.public_id) {
        try {
          await deleteFromCloudinary(existing.image_url.public_id);
        } catch (err) {
          console.warn("Old image delete failed:", err);
        }
      }
    } else {
      // ✅ Keep existing image
      image_url = existing.image_url;
    }

    // ✅ Validate
    const parsed = categorySchema.safeParse({
      title,
      description,
      priority,
      is_active,
      image_url,
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

    // ✅ Update DB
    const { data, error } = await supabaseServer
      .from("categories")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Update failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Category updated successfully",
      data,
    });

  } catch (err: any) {
    console.error("PUT /category error:", err);

    return Response.json(
      {
        success: false,
        message: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
    try {
        await requireAdmin();

        const { id } = await params;

        if (!id) {
            return Response.json(
                { success: false, message: "Category ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { is_active } = body;

        // ✅ Validate input
        if (typeof is_active !== "boolean") {
            return Response.json(
                {
                    success: false,
                    message: "is_active must be boolean",
                },
                { status: 400 }
            );
        }

        // ✅ Update only status
        const { data, error } = await supabaseServer
            .from("categories")
            .update({ is_active })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return Response.json(
                {
                    success: false,
                    message: "Status update failed",
                    error: error.message,
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: `Category ${is_active ? "activated" : "deactivated"
                } successfully`,
            data,
        });

    } catch (err: any) {
        console.error("PATCH /category status error:", err);

        return Response.json(
            {
                success: false,
                message: err?.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    // 🟡 Soft delete (no actual delete)
    const { data, error } = await supabaseServer
      .from("categories")
      .update({
        deleted: true,
        is_active: false,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Delete failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Category moved to trash",
      data,
    });

  } catch (err: any) {
    console.error("DELETE (soft) /category error:", err);

    return Response.json(
      {
        success: false,
        message: err?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}