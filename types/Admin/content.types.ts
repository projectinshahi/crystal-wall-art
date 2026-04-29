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
    description?: string;
    image: string;
    link_url?: string;
    deleted: boolean;
    is_active: boolean;
    priority?: number;
}