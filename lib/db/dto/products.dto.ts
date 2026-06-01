import { ProductImage, ProductTypes, ProductVariantTypes } from "@/types/Admin/products.types";

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
    thickness: string[];
    mounting_methods: string[];
    orientations: string[];
    thumbnail: string;
    images?: string[];

};

export type AdminProductDetailsDTO = AdminProductDTO & {
    images: ProductImage[];
    variants: ProductVariantTypes[];
    category_title?: string;
};

export type { ProductImage, ProductVariantTypes };

export type PublicProductDTO = {
    id: string;
    title: string;
    description: string;
    price: number;
    discount_price: number;
    category_id: string;
    sizes: string[];
    thickness: string[];
    mounting_methods: string[];
    orientations: string[];
    thumbnail: string;
    images?: ProductImage[];
};

export type PublicProductVariantDTO = {
    id: string;
    product_id: string;
    size: string;
    thickness: number;
    price: number;
    discount_price: number;
    orientation: string;
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
        thickness: row.thickness,
        mounting_methods: row.mounting_methods,
        orientations: row.orientations,
        thumbnail: row.thumbnail
    };
}

export function toPublicProductDTO(
    row: ProductTypes
): PublicProductDTO {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        discount_price: row.discount_price,
        category_id: row.category_id,
        sizes: row.sizes,
        thickness: row.thickness,
        mounting_methods: row.mounting_methods,
        orientations: row.orientations,
        thumbnail: row.thumbnail,
        images: row.images?.map(image => image) ?? []
    };
}

export function toPublicProductVariantDTO(
    row: ProductVariantTypes
): PublicProductVariantDTO {
    return {
        id: row.id,
        product_id: row.product_id,
        size: row.size,
        thickness: row.thickness,
        price: row.price,
        discount_price: row.discount_price,
        orientation: row.orientation
    }

}