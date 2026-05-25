export type OrderItemDTO = {
    id: string;
    product_title: string;
    product_image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
};

export function toOrderItemDTO(row: any): OrderItemDTO {
    return {
        id: row.id,
        product_title: row.product_title,
        product_image: row.product_image,
        quantity: Number(row.quantity),
        unit_price: Number(row.unit_price),
        total_price: Number(row.total_price)
    };
}