import { readQuery } from "@/lib/db";
import { PublicCategoryDTO, toPublicCategoryDTO } from "../../dto/category.dto";
import { CategoryPublicQueries } from "../../queries/public/category.public.queries";
import { CategoryTypes } from "@/types/Admin/categories.types";

export async function getPublicCategories(): Promise<PublicCategoryDTO[]> {

    const conditions: string[] = [];

    conditions.push(` deleted = FALSE AND is_active = TRUE `);

    const whereClause = `
        WHERE ${conditions.join(" AND ")}
    `;

    const query = `
    ${CategoryPublicQueries.getAll}
    
    ${whereClause}
    
    ORDER BY priority ASC, created_at DESC`;

    const rows = await readQuery<CategoryTypes>(query)

    return rows.map(
        toPublicCategoryDTO
    )
}

export async function getPublicCategoryById(id: string): Promise<PublicCategoryDTO> {
    const query = CategoryPublicQueries.categoryById;

    const rows = await readQuery<CategoryTypes>(query, [id])

    return toPublicCategoryDTO(rows[0])
}