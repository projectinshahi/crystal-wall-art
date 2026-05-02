import { CategoryTypes } from "@/types/Admin/categories.types";

export type AdminCategoryDTO = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  priority: number;
  is_active: boolean;
  deleted: boolean
  created_at: string;
  updated_at: string;
};

export function toAdminCategoryDTO(
  row: CategoryTypes
): AdminCategoryDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image_url: row.image_url,
    priority: row.priority,
    is_active: row.is_active,
    deleted: row.deleted,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}