export type ShipmentStatus = "pending" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export type OrderedItemsTypes = {
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

export type OrderedShipmentsTypes = {
    id: string;
    order_id: string;
    shipment_number: string;
    courier: string;
    tracking_id: string;
    status: ShipmentStatus;
    notes: string;
    shipped_at: string;
    delivered_at: string;
    created_at: string;
    updated_at: string;
}

export type OrderedShipmentItemsTypes = {
    id: string;
    shipment_id: string;
    order_item_id: string;
    quantity: string;
    created_at: string;
}

export type OrderTimelinesTypes = {
    id: string;
    order_id: string;
    status: string;
    note: string;
    created_at: string;
}