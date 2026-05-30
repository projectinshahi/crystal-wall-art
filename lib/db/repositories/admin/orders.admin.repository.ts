import { readQuery, writeQuery } from "@/lib/db";
import { OrdersAdminQueries } from "../../queries/admin/orders.admin.queries";
import { AdminOrderDTO, toAdminOrderDTO } from "../../dto/order.dto";
import { PaginationMeta } from "../../content.db";
import { AdminOrderedItemsDTO, toAdminOrderedItemsDTO } from "../../dto/orderItems.dto";
import { OrderedItemsAdminQueries } from "../../queries/admin/orderedItems.admin.queries";
import { OrderedShipmentsAdminQueries } from "../../queries/admin/orderedShipments.admin.queries";
import { AdminOrderedShipmentsDTO, toAdminOrderedShipmentsDTO } from "../../dto/orderedShipments.dto";
import { AdminOrderTimelinesDTO, toAdminOrderTimelinesDTO } from "../../dto/orderedTimelines.dto";
import { OrderTimelinesAdminQueries } from "../../queries/admin/orderTimelines.admin.queries";
import { AdminOrderedShipmentItemsDTO, toAdminOrderedShipmentItemsDTO } from "../../dto/orderedShipmentItems.dto";

interface GetAdminOrderParams {
  id?: string | null;
  page?: number;
  limit?: number;
  paymentStatus?: string;
  status?: string;
  search?: string;
}

interface GetAdminOrderResponse {
  data: AdminOrderDTO[];
  pagination: PaginationMeta;
}

export async function getAdminOrders(
  filters?: GetAdminOrderParams
): Promise<GetAdminOrderResponse> {

  const conditions: string[] = [];
  const values: unknown[] = [];

  // =====================
  // BASE FILTERS
  // =====================
  if (filters?.id) {
    values.push(filters.id);
    conditions.push(`id = $${values.length}`);
  }

  if (filters?.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters?.paymentStatus) {
    values.push(filters.paymentStatus);
    conditions.push(`payment_status = $${values.length}`);
  }

  if (filters?.search) {
    const searchValue = `%${filters.search}%`;
    values.push(searchValue);

    const param = `$${values.length}`;

    conditions.push(`
    (
      LOWER(customer_name) LIKE LOWER(${param})
      OR LOWER(customer_email) LIKE LOWER(${param})
      OR customer_phone LIKE ${param}
      OR LOWER(order_number) LIKE LOWER(${param})
    )
  `);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // =====================
  // PAGINATION
  // =====================
  const page = Math.max(1, filters?.page || 1);
  const limit = Math.min(100, Math.max(1, filters?.limit || 20));
  const offset = (page - 1) * limit;

  // =====================
  // COUNT QUERY (same filters!)
  // =====================
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM orders
    ${whereClause}
  `;

  const countRows = await readQuery<{ total: number }>(
    countQuery,
    values
  );

  const total = countRows[0]?.total ?? 0;

  // =====================
  // DATA QUERY (reuse filters)
  // =====================
  const dataValues = [...values];

  // add pagination params safely
  dataValues.push(limit);
  dataValues.push(offset);

  const query = `
    ${OrdersAdminQueries.getAll}
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${dataValues.length - 1}
    OFFSET $${dataValues.length}
  `;

  const rows = await readQuery<AdminOrderDTO>(query, dataValues);

  return {
    data: rows.map(toAdminOrderDTO),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAdminOrderedItemsByOrderId(orderId: string): Promise<AdminOrderedItemsDTO[]> {

  const query = OrderedItemsAdminQueries.getAllByOrderId;

  const rows = await readQuery<AdminOrderedItemsDTO>(query, [orderId]);

  return rows.map(toAdminOrderedItemsDTO)

}

export async function getAdminOrderedShipmentsByOrderId(orderId: string): Promise<AdminOrderedShipmentsDTO[]> {

  const query = OrderedShipmentsAdminQueries.getAllByOrderId;

  const rows = await readQuery<AdminOrderedShipmentsDTO>(query, [orderId]);

  return rows.map(toAdminOrderedShipmentsDTO)

}

export async function addAdminOrderedShipmentsByOrderId(orderId: string, shipmentNumber: string, courier: string, trackingId: string): Promise<AdminOrderedShipmentsDTO[]> {

  const query = OrderedShipmentsAdminQueries.createShipment;

  const rows = await writeQuery<AdminOrderedShipmentsDTO>(query, [orderId, shipmentNumber, courier, trackingId, "pending"]);

  return rows.map(toAdminOrderedShipmentsDTO)

}

export async function deleteAdminOrderShipmentById(shipmentId: string) {
  const query = OrderedShipmentsAdminQueries.deleteShipment;

  const rows = await writeQuery<AdminOrderedShipmentsDTO>(
    query,
    [shipmentId]
  );

  return rows.map(toAdminOrderedShipmentsDTO);
}

type UpdateShipmentPayload = {
  courier?: string;
  tracking_id?: string;
  status?: string;
  notes?: string;
  shipped_at?: string | null;
  delivered_at?: string | null;
};

export async function updateAdminShipmentById(
  shipmentId: string,
  payload: UpdateShipmentPayload
): Promise<AdminOrderedShipmentsDTO | null> {

  const query = OrderedShipmentsAdminQueries.updateShipment;

  const rows = await writeQuery<AdminOrderedShipmentsDTO>(
    query,
    [
      shipmentId,
      payload.courier ?? null,
      payload.tracking_id ?? null,
      payload.status ?? null,
      payload.notes ?? null,
      payload.shipped_at ?? null,
      payload.delivered_at ?? null,
    ]
  );

  if (!rows.length) {
    return null;
  }

  return toAdminOrderedShipmentsDTO(rows[0]);
}

export async function getAdminOrderTimelinesByOrderId(orderId: string): Promise<AdminOrderTimelinesDTO[]> {

  const query = OrderTimelinesAdminQueries.getAllByOrderId;

  const rows = await readQuery<AdminOrderTimelinesDTO>(query, [orderId]);

  return rows.map(toAdminOrderTimelinesDTO)

}

export async function getAdminShipmentItemsByShipmentIds(shipmentIds: string[]): Promise<AdminOrderedShipmentItemsDTO[]> {
  if (!shipmentIds.length) return [];

  const query = `
        SELECT *
        FROM shipment_items
        WHERE shipment_id = ANY($1::uuid[])
        ORDER BY created_at ASC
    `;

  const rows = await readQuery<AdminOrderedShipmentItemsDTO>(query, [shipmentIds]);

  return rows.map(toAdminOrderedShipmentItemsDTO)
}

export async function addShipmentItems(
  shipmentId: string,
  items: {
    order_item_id: string;
    quantity: number;
  }[]
) {
  if (!items.length) return [];

  const values = items
    .map(
      (_, index) =>
        `($1, $${index * 2 + 2}, $${index * 2 + 3})`
    )
    .join(", ");

  const params = [
    shipmentId,
    ...items.flatMap((item) => [
      item.order_item_id,
      item.quantity,
    ]),
  ];

  const query = `
        INSERT INTO shipment_items (
            shipment_id,
            order_item_id,
            quantity
        )
        VALUES ${values}
        RETURNING *;
    `;

  return await writeQuery(query, params);
}