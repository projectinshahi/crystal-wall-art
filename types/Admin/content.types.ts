import { contentSchema } from "@/schema/content.schema";
import { z } from "zod";

// Raw form values (React Hook Form)
export type ContentFormInput = z.input<typeof contentSchema>;

// Validated output (API / DB)
export type ContentData = z.infer<typeof contentSchema>;

export interface ContentFormOutput {
    id: string;
    type: string;
    title: string;
    description: string | null;
    image: string | null;
    link_url: string | null;
    priority: number;
    is_active: boolean;
    deleted: boolean;
    created_at: string;
    updated_at: string;
}