import { ok, okList, withHandler } from "@/lib/api/handler";
import { addAdminOrderedShipmentsByOrderId, addShipmentItems, deleteAdminOrderShipmentById, getAdminOrderedShipmentsByOrderId, updateAdminShipmentById } from "@/lib/db/repositories/admin/orders.admin.repository";
import { sanitizeString } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({ params }): Promise<NextResponse> => {
        const routeParams = await params;

        const orderId = routeParams?.id;

        const shipments = await getAdminOrderedShipmentsByOrderId(orderId as string)

        const response = okList(shipments);

        response.headers.set(
            "Cache-Control",
            "no-store"
        );

        return response;
    }, { access: "admin" }
)

export const POST = withHandler(
    async ({ req, params }): Promise<NextResponse> => {
        const routeParams = await params;

        const orderId = routeParams?.id;

        const formData = await req.formData();

        const shipmentNumber = sanitizeString(String(formData.get("shipmentNumber") || ""), 120);
        const courier = sanitizeString(String(formData.get("courier") || ""), 120);
        const trackingId = sanitizeString(String(formData.get("trackingId") || ""), 120);

        const items = JSON.parse(
            String(formData.get("items") || "[]")
        );

        const shipment = await addAdminOrderedShipmentsByOrderId(orderId as string, shipmentNumber, courier, trackingId)

        if (!shipment?.length) {
            throw new Error("Failed to create shipment");
        }

        await addShipmentItems(
            shipment[0].id,
            items
        );

        const response = okList(shipment);

        response.headers.set(
            "Cache-Control",
            "no-store"
        );
    }, { access: "admin" }
)

export const DELETE = withHandler(
    async ({ req }): Promise<NextResponse> => {
        try {
            const { searchParams } = new URL(req.url);

            const shipmentId = searchParams.get("shipment_id");

            if (!shipmentId) {
                throw new Error("Shipment ID is required");
            }

            if (!shipmentId) {
                throw new Error("Shipment ID is required");
            }

            await deleteAdminOrderShipmentById(shipmentId);

            const response = ok({
                message: "Shipment deleted successfully",
            });

            response.headers.set(
                "Cache-Control",
                "no-store"
            );

            return response;
        } catch (error) {
            console.error("DELETE shipment error:", error);

            throw error;
        }
    },
    { access: "admin" }
);

export const PATCH = withHandler(
    async ({ req }): Promise<NextResponse> => {
        try {
            const { searchParams } = new URL(req.url);

            const shipmentId = searchParams.get("shipment_id");

            if (!shipmentId) {
                throw new Error("Shipment ID is required");
            }

            if (!shipmentId) {
                throw new Error("Shipment ID is required");
            }

            if (!shipmentId) {
                throw new Error("Shipment ID is required");
            }

            const body = await req.json();

            const updatedShipment =
                await updateAdminShipmentById(
                    shipmentId,
                    body
                );

            if (!updatedShipment) {
                throw new Error("Shipment not found");
            }

            const response = ok({
                message: "Shipment updated successfully",
                data: updatedShipment,
            });

            response.headers.set(
                "Cache-Control",
                "no-store"
            );

            return response;
        } catch (error) {
            console.error(
                "PATCH shipment error:",
                error
            );

            throw error;
        }
    },
    { access: "admin" }
);