import { readQuery } from "@/lib/db";
import { PublicProductDTO, PublicProductVariantDTO, toPublicProductDTO, toPublicProductVariantDTO } from "../../dto/products.dto";
import { ProductPublicQueries } from "../../queries/public/product.public.queries";
import { ProductTypes, ProductVariantTypes } from "@/types/Admin/products.types";

export const getPublicProductByCategoryId = async (categoryId: string): Promise<PublicProductDTO[]> => {
    const query = ProductPublicQueries.productsByCategoryId;

    const rows = await readQuery<ProductTypes>(query, [categoryId])

    return rows.map(
        toPublicProductDTO
    )
}

export const getPublicProductById = async (productId: string): Promise<PublicProductDTO> => {
    const query = ProductPublicQueries.productById;

    const rows = await readQuery<ProductTypes>(query, [productId])

    return toPublicProductDTO(rows[0])
}

export const getPublicProductVariants = async (productId: string): Promise<PublicProductVariantDTO[]> => {
    const query = ProductPublicQueries.productVariants;

    const rows = await readQuery<ProductVariantTypes>(query, [productId])

    return rows.map(
        toPublicProductVariantDTO
    )
}