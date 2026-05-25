import { OrderedItemsTypes } from "@/types/Admin/orders.types";

export type AdminOrderedItemsDTO = {
    id: string;
    order_id: string;
    product_id: string;
    variant_id?: string;
    product_title: string;
    product_image: string;
    size?: string;
    thickness?: string;
    mounting_method?: string;
    orientation?: string;
    quantity: string;
    unit_price: string;
    total_price: string;
    created_at: string;
    options: string;
}

export function toAdminOrderedItemsDTO(
    row: OrderedItemsTypes
): AdminOrderedItemsDTO {

    return {
        id: row.id,
        order_id: row.id,
        product_id: row.product_id,
        variant_id: row.variant_id,
        product_title: row.product_title,
        product_image: row.product_image,
        size: row.size,
        thickness: row.thickness,
        mounting_method: row.mounting_method,
        orientation: row.orientation,
        quantity: row.quantity,
        unit_price: row.unit_price,
        total_price: row.total_price,
        created_at: row.created_at,
        options: row.options
    };
}