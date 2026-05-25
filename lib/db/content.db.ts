import { ContentFormInput } from "@/types/Admin/content.types";
import { DBResponse } from "@/types/dbResponse.types";
import { readQuery, writeQuery } from "../db";

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const addContent = async (
    formData: ContentFormInput
): Promise<DBResponse<any, null>> => {

    try {

        const query = `
            INSERT INTO contents (
                type,
                title,
                description,
                link_url,
                image,
                priority,
                is_active
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING *
        `;

        const values = [
            formData.type,
            formData.title,
            formData.description,
            formData.link_url,
            formData.image,
            formData.priority
        ];

        const rows = await writeQuery<any>(query, values);

        return {
            success: true,
            data: rows?.[0] || null,
            error: null,
            meta: null,
        };

    } catch (err: any) {

        console.error("addContent error:", err);

        return {
            success: false,
            data: null,
            error: err?.message || "Unknown error",
            meta: null,
        };
    }
};

export const getContents = async ({
    page,
    limit,
    type,
    is_active,
}: {
    page?: number;
    limit?: number;
    type?: string;
    is_active?: boolean;
}): Promise<DBResponse<any[], PaginationMeta>> => {
    try {

        const conditions: string[] = [];

        conditions.push(`deleted = false`);

        // Filters
        if (type) {
            conditions.push(`type = '${type}'`);
        }

        if (is_active !== undefined) {
            conditions.push(`is_active = ${is_active}`);
        }

        const whereClause = `
            ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
        `;

        // Pagination
        let paginationClause = "";
        let meta: PaginationMeta | null = null;

        if (page !== undefined && limit !== undefined) {

            const safePage = Math.max(page, 1);
            const safeLimit = Math.min(Math.max(limit, 1), 50);

            const offset = (safePage - 1) * safeLimit;

            paginationClause = `
                LIMIT ${safeLimit}
                OFFSET ${offset}
            `;

            meta = {
                page: safePage,
                limit: safeLimit,
                total: 0,
                totalPages: 0,
            };
        }

        // Main Query
        const query = `
            SELECT *
            FROM contents

            ${whereClause}

            ORDER BY created_at DESC

            ${paginationClause}
        `;

        // Count Query
        const countQuery = `
            SELECT COUNT(*)::int as total
            FROM contents

            ${whereClause}
        `;

        const [rows, countRows] = await Promise.all([
            readQuery<any>(query),
            readQuery<{ total: number }>(countQuery),
        ]);

        const total = countRows?.[0]?.total ?? 0;

        // Update meta
        if (meta) {
            meta.total = total;
            meta.totalPages = total
                ? Math.ceil(total / meta.limit)
                : 0;
        }

        return {
            success: true,
            data: rows ?? [],
            error: null,
            meta,
        };

    } catch (err: any) {

        return {
            success: false,
            data: null,
            error: err?.message || "Unknown error",
            meta: null,
        };
    }
};

export const toogleContentStatus = async ({
    id,
    is_active,
}: {
    id: string;
    is_active: boolean;
}): Promise<DBResponse<any, null>> => {

    try {

        const query = `
            UPDATE contents
            SET
                is_active = $1,
                updated_at = NOW()
            WHERE id = $2
              AND deleted = FALSE
            RETURNING *
        `;

        const values = [
            is_active,
            id,
        ];

        const rows = await writeQuery<any>(query, values);

        return {
            success: true,
            data: rows?.[0] || null,
            error: null,
            meta: null,
        };

    } catch (err: any) {

        console.error("toogleContentStatus error:", err);

        return {
            success: false,
            data: null,
            error: err?.message || "Unknown error",
            meta: null,
        };
    }
};

export const deleteContent = async ({
    id,
}: {
    id: string;
}): Promise<DBResponse<any, null>> => {

    try {

        const query = `
            UPDATE contents
            SET
                deleted = TRUE,
                is_active = FALSE,
                updated_at = NOW()
            WHERE id = $1
              AND deleted = FALSE
            RETURNING *
        `;

        const values = [id];

        const rows = await writeQuery<any>(query, values);

        return {
            success: true,
            data: rows?.[0] || null,
            error: null,
            meta: null,
        };

    } catch (err: any) {

        console.error("deleteContent error:", err);

        return {
            success: false,
            data: null,
            error: err?.message || "Unknown error",
            meta: null,
        };
    }
};