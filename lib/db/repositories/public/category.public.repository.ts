import { readQuery } from "@/lib/db";
import { PublicCategoryDTO, toPublicCategoryDTO } from "../../dto/category.dto";
import { CategoryPublicQueries } from "../../queries/public/category.public.queries";
import { CategoryTypes } from "@/types/Admin/categories.types";

// Default: main categories. With parentId: the active subcategories of that category.
export async function getPublicCategories(parentId: string | null = null): Promise<PublicCategoryDTO[]> {

    try {

        const conditions: string[] = [];
        const values: unknown[] = [];

        conditions.push(`deleted = FALSE`);
        conditions.push(`is_active = TRUE`);

        if (parentId) {
            values.push(parentId);
            conditions.push(`parent_id = $${values.length}`);
        } else {
            conditions.push(`parent_id IS NULL`);
        }

        const whereClause = `
            WHERE ${conditions.join(" AND ")}
        `;

        const query = `
            ${CategoryPublicQueries.getAll}

            ${whereClause}

            ORDER BY priority ASC, created_at DESC
        `;

        const rows = await readQuery<CategoryTypes>(query, values);

        const categories = rows.map(toPublicCategoryDTO);

        return categories;

    } catch (err: any) {

        console.error(
            "[getPublicCategories] Error:",
            err?.message || err
        );

        throw err;
    }
}

export async function getPublicCategoryById(id: string): Promise<PublicCategoryDTO> {
    const query = CategoryPublicQueries.categoryById;

    const rows = await readQuery<CategoryTypes>(query, [id])

    return toPublicCategoryDTO(rows[0])
}
