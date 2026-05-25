import { readQuery } from "@/lib/db";
import { AdminProductDTO, toAdminProductDTO } from "../../dto/products.dto";
import { ProductAdminQueries } from "../../queries/admin/product.admin.queries";
import { ProductTypes } from "@/types/Admin/products.types";
import { PoolClient } from "pg";
import { ProductFormValues } from "@/schema/product.schema";
import { err } from "@/lib/api/handler";

interface GetAdminProductsParams {
  id?: string;
  title?: string;
  is_active?: boolean;

  page?: number;
  limit?: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface GetAdminProductsResponse {
  data: AdminProductDTO[];
  pagination: PaginationMeta;
}

export async function getAdminProducts(
  filters?: GetAdminProductsParams
): Promise<GetAdminProductsResponse> {

  const conditions: string[] = [];
  const values: unknown[] = [];

  conditions.push(`deleted = FALSE`);

  if (filters?.id) {
    values.push(filters.id);
    conditions.push(`id = $${values.length}`);
  }

  if (filters?.title) {
    values.push(`%${filters.title}%`);

    conditions.push(`LOWER(title) LIKE LOWER($${values.length})`);
  }

  const whereClause = `
    WHERE ${conditions.join(" AND ")}
  `;

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM products
    ${whereClause}
  `;

  const countRows = await readQuery<{
    total: number;
  }>(
    countQuery,
    values
  );

  const total = countRows[0]?.total || 0;
  
  values.push(limit);
  values.push(offset);

  const query = `
    ${ProductAdminQueries.getAll}

    ${whereClause}

    ORDER BY created_at DESC

    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const rows = await readQuery<ProductTypes>(
    query,
    values
  );
  
  return {
    data: rows.map(toAdminProductDTO),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}

export const createProduct = async (client: PoolClient, data: ProductFormValues): Promise<AdminProductDTO> => {
    const result = await client.query<ProductTypes>(
        ProductAdminQueries.create,
        [
            data.title,
            data.description,
            data.price,
            data.discount_price || null,
            data.stock_quantity,
            data.category,
            data.status,
            data.sizes,
            data.thickness,
            data.mounting_method,
            data.orientation,
            data.thumbnail
        ]
    );

    return toAdminProductDTO(result.rows[0]);
}

export const insertProductImages = async (client:PoolClient, productId: string, imageUrls: string[]): Promise<any> => {
    
    if(!imageUrls || imageUrls.length === 0) {
        return;
    }

    const values: string[] = [];
    const placeholders: string[] = [];

    imageUrls.forEach((url, index) => {
        values.push(url);
        placeholders.push(`($1, $${index + 2})`);
    });

    const query = `
        INSERT INTO product_images (product_id, image_url)
        VALUES ${placeholders.join(", ")}
    `;

    await client.query(query, [productId, ...values]);
}

export const insertProductVariants = async (
    client: PoolClient,
    variants: {
        product_id: string,
        size: string,
        thickness: string,
        price: number,
        discount_price: number | null,
        orientation: string,
        stock_quantity: number
    }[]): Promise<any> => {
    if (!variants || variants.length === 0) {
        return;
    }

    const values: unknown[] = [];
    const placeholders: string[] = [];

    variants.forEach((variant, index) => {
        values.push(variant.product_id, variant.size, variant.thickness, variant.price, variant.discount_price, variant.orientation, variant.stock_quantity);
        const baseIndex = index * 7;
        placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`);
    });

    const query = `
        INSERT INTO product_variants (product_id, size, thickness, price, discount_price, orientation, stock_quantity)
        VALUES ${placeholders.join(", ")}
    `;

    await client.query(query, values);
}