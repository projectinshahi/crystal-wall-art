import { err, ok, withHandler } from "@/lib/api/handler";
import { getAdminProducts, updateProductStatus } from "@/lib/db/repositories/admin/products.admin.repository";
import { NextResponse } from "next/server";

export const PATCH = withHandler(
  async ({ req, params }): Promise<NextResponse> => {

    const routeParams = await params;

    const productID = routeParams?.id;

    if (!productID) {
      return err(
        "Product ID is required",
        400
      );
    }

    const body = await req.json();

    const { is_active } = body;

    if (typeof is_active !== "boolean") {
      return err(
        "is_active must be boolean",
        400
      );
    }

    // CHECK EXISTS
    const existing = await getAdminProducts({ id: productID });

    if (!existing) {
      return err(
        "Product not found",
        404
      );
    }

    // UPDATE
    const updated = await updateProductStatus(productID, is_active);

    return ok({
      message: `Product ${is_active
        ? "activated"
        : "deactivated"
        } successfully`,

      data: updated,
    });
  },
  {
    access: "admin",
  }
);