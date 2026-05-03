import { ProductTypes } from "@/types/Admin/products.types";

export type AdminProductDTO = {
    id: string;
    title: string;
    description: string;
    price: number;
    discount_price: number;
    stock_quantity: number;
    category_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    sizes: string[];
    thicknesses: string[];
    mounting_methods: string[];
    orientations: string[];
    thumbnail: string;
};

export function toAdminProductDTO(
    row: ProductTypes
): AdminProductDTO {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        discount_price: row.discount_price,
        stock_quantity: row.stock_quantity,
        category_id: row.category_id,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        sizes: row.sizes,
        thicknesses: row.thicknesses,
        mounting_methods: row.mounting_methods,
        orientations: row.orientations,
        thumbnail: row.thumbnail
    };
}