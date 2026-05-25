import { ContentFormInput, ContentFormOutput } from "@/types/Admin/content.types";
import { AdminContentDTO, toAdminContentDTO } from "../../dto/contents.dto";
import { readQuery, writeQuery } from "@/lib/db";
import { ContentAdminQueries } from "../../queries/admin/content.admin.queries";
import { PoolClient } from "pg";

interface GetAdminCategoriesParams {
    id?: string;
    title?: string;
    type?: string;
    is_active?: boolean;
}

export async function getAdminContents(
    filters?: GetAdminCategoriesParams
): Promise<AdminContentDTO[]> {

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

    // TYPE FILTER
    if (filters?.type) {

        values.push(
            `%${filters.type}%`
        );

        conditions.push(`
      LOWER(type)
      LIKE LOWER($${values.length})
    `);
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
    ${ContentAdminQueries.getAll}

    ${whereClause}

    ORDER BY
      priority ASC,
      created_at DESC
  `;

    const rows =
        await readQuery<ContentFormOutput>(
            query,
            values
        );

    return rows.map(
        toAdminContentDTO
    );
}

export async function createContent(client: PoolClient, data: ContentFormInput): Promise<AdminContentDTO> {
    const result = await client.query<ContentFormOutput>(
        ContentAdminQueries.create,
        [
            data.type,
            data.title,
            data.description,
            data.link_url,
            data.image,
            data.priority,
        ]
    );

    return toAdminContentDTO(result.rows[0]);
}

export async function softDeleteContent(client: PoolClient, id: string): Promise<AdminContentDTO> {
    const result = await client.query<ContentFormOutput>(
        ContentAdminQueries.softDelete,
        [id]
    );

    return toAdminContentDTO(result.rows[0]);
}

export async function updateContentStatus(id: string, is_active:boolean): Promise<AdminContentDTO> {
    const rows = await writeQuery<ContentFormOutput>(
        ContentAdminQueries.updateStatus,
        [id, is_active]
    );

    return toAdminContentDTO(rows[0]);
}

export async function updateContent(id: string, data: ContentFormInput): Promise<AdminContentDTO> {
    const rows = await writeQuery<ContentFormOutput>(
        ContentAdminQueries.update,
        [
            id,
            data.type,
            data.title,
            data.description,
            data.link_url,
            data.image,
            data.priority
        ]
    );

    return toAdminContentDTO(rows[0]);
}