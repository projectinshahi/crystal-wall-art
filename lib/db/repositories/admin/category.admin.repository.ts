
import { readQuery, writeQuery } from "@/lib/db";
import { CategoryAdminQueries } from "../../queries/admin/category.admin.queries";
import { CategoryTypes } from "@/types/Admin/categories.types";
import { AdminCategoryDTO, toAdminCategoryDTO } from "../../dto/category.dto";
import { CategoryApiInput } from "@/schema/category.schema";
import { PoolClient } from "pg";

interface GetAdminCategoriesParams {
  id?: string;
  title?: string;
  is_active?: boolean;
  // null → main categories only; string → subcategories of that category; undefined → all
  parentId?: string | null;
}

export async function getAdminCategories(
  filters?: GetAdminCategoriesParams
): Promise<AdminCategoryDTO[]> {

  const conditions: string[] = [];

  const values: unknown[] = [];

  // DEFAULT FILTER
  conditions.push(`
    deleted = FALSE
  `);

  // ID FILTER
  if (filters?.id) {

    values.push(filters.id);

    conditions.push(`
      id = $${values.length}
    `);
  }

  // TITLE FILTER
  if (filters?.title) {

    values.push(
      `%${filters.title}%`
    );

    conditions.push(`
      LOWER(title)
      LIKE LOWER($${values.length})
    `);
  }

  // PARENT FILTER
  if (filters?.parentId === null) {
    conditions.push(`parent_id IS NULL`);
  } else if (typeof filters?.parentId === "string") {
    values.push(filters.parentId);
    conditions.push(`parent_id = $${values.length}`);
  }

  // ACTIVE FILTER
  if (
    typeof filters?.is_active ===
    "boolean"
  ) {

    values.push(
      filters.is_active
    );

    conditions.push(`
      is_active = $${values.length}
    `);
  }

  const whereClause = `
    WHERE ${conditions.join(
      " AND "
    )}
  `;

  const query = `
    ${CategoryAdminQueries.getAll}

    ${whereClause}

    ORDER BY
      priority ASC,
      created_at DESC
  `;

  const rows =
    await readQuery<CategoryTypes>(
      query,
      values
    );

  return rows.map(
    toAdminCategoryDTO
  );
}

export async function createCategory(
  client: PoolClient,
  data: CategoryApiInput,
  parentId: string | null = null
): Promise<AdminCategoryDTO> {
  const result =
    await client.query<CategoryTypes>(
      CategoryAdminQueries.create,
      [
        data.title,
        data.description,
        data.image_url,
        data.priority,
        data.is_active,
        parentId,
      ]
    );

  return toAdminCategoryDTO(
    result.rows[0]
  );
}

export async function softDeleteCategory(
  client: PoolClient,
  id: string
): Promise<AdminCategoryDTO> {

  const result =
    await client.query<CategoryTypes>(
      CategoryAdminQueries.softDelete,
      [id]
    );

  return toAdminCategoryDTO(
    result.rows[0]
  );
}

export async function updateCategoryStatus(
  id: string,
  is_active: boolean
): Promise<AdminCategoryDTO> {

  const rows =
    await writeQuery<CategoryTypes>(
      CategoryAdminQueries.updateStatus,
      [
        is_active,
        id,
      ]
    );

  return toAdminCategoryDTO(
    rows[0]
  );
}

export async function updateCategory(
  id: string,
  data: CategoryApiInput
): Promise<AdminCategoryDTO> {

  const rows =
    await writeQuery<CategoryTypes>(
      CategoryAdminQueries.update,
      [
        data.title,
        data.description,
        data.image_url,
        data.priority,
        data.is_active,
        id,
      ]
    );

  return toAdminCategoryDTO(
    rows[0]
  );
}

// Products may only be attached to a subcategory: an existing (non-deleted) category that has a parent.
export async function isSubcategory(id: unknown): Promise<boolean> {
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return false;
  }

  const [category] = await getAdminCategories({ id });

  return !!category?.parent_id;
}
