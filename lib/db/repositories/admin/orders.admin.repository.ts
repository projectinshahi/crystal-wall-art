import { readQuery } from "@/lib/db";
import { OrdersAdminQueries } from "../../queries/admin/orders.admin.queries";
import { AdminOrderDTO, toAdminOrderDTO } from "../../dto/order.dto";
import { PaginationMeta } from "../../content.db";

interface GetAdminOrderParams {
  page?: number;
  limit?: number;
}

interface GetAdminOrderResponse {
  data: AdminOrderDTO[];
  pagination: PaginationMeta;
}

export async function getAdminOrders(filters?: GetAdminOrderParams): Promise<GetAdminOrderResponse> {

    const values: unknown[] = [];

    const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM orders
  `;

  const countRows = await readQuery<{
    total: number;
  }>(
    countQuery
  );

  const total = countRows[0]?.total || 0;

  values.push(limit);
  values.push(offset);

    const query = `
    ${OrdersAdminQueries.getAll}
    
    ORDER BY
    created_at DESC
    
    LIMIT $${values.length - 1}
    OFFSET $${values.length}`;
    
    const rows = await readQuery<AdminOrderDTO>(query, values);

    return {
        data: rows.map(toAdminOrderDTO),
    
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