import { deleteContent, toogleContentStatus } from "@/lib/db/content.db";
import { requireAdmin } from "@/lib/session";

interface Params {
    params: {
        id: string;
    };
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
        const updateStatus = await toogleContentStatus({ id, is_active })

        if (!updateStatus.success) {
            return Response.json(
                {
                    success: false,
                    message: "Status update failed",
                    error: updateStatus.error,
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: `Content ${is_active ? "activated" : "deactivated"
                } successfully`,
        });

    } catch (err: any) {
        console.error("PATCH /content status error:", err);

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
                { success: false, message: "Content ID is required" },
                { status: 400 }
            );
        }

        const deleteData = await deleteContent({ id })


        if (!deleteData.success) {
            return Response.json(
                {
                    success: false,
                    message: "Delete failed",
                    error: deleteData.error,
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: `Content moved to trash`,
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