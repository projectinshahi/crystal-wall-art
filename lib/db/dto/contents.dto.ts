import { ContentFormOutput } from "@/types/Admin/content.types";

export type AdminContentDTO = {
    id: string;
    type: string;
    title: string;
    description: string | null;
    link_url: string | null;
    image: string | null;
    priority: number;
    is_active: boolean;
    deleted: boolean;
    created_at: string;
    updated_at: string;
}

export function toAdminContentDTO(
  row: ContentFormOutput
): AdminContentDTO {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    link_url: row.link_url,
    image: row.image,
    priority: row.priority,
    is_active: row.is_active,
    deleted: row.deleted,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}