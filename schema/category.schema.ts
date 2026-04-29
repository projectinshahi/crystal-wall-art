import { z } from "zod";

// ── image shapes ──────────────────────────────────────────────

export const uploadedImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  public_id: z.string().min(1, "Invalid image"),
});

export const pendingImageSchema = z.object({
  __pendingFile: z.custom<File>((v) => v instanceof File, "Invalid file"),
  __folder: z.string(),
  previewUrl: z.string().startsWith("blob:", "Invalid preview URL"),
});

export const imageFieldSchema = z.union([uploadedImageSchema, pendingImageSchema]);

// ── category schema ───────────────────────────────────────────

export const categorySchema = z.object({
  id: z.string().optional(),

  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters")
    .trim(),

  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .nullable()
    .transform((v) => v ?? ""),

  image_url: imageFieldSchema.refine(
    (val) => !!val,
    "Category image is required"
  ),

  priority: z.coerce
    .number()
    .int("Priority must be a whole number")
    .min(0, "Priority must be 0 or greater")
    .max(999, "Priority must be under 999")
    .default(0),

  is_active: z.boolean().default(true),

  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormOutput = z.output<typeof categorySchema>;

// ── strict schema for API submission (no pending files) ───────

export const categoryApiSchema = categorySchema.extend({
  image_url: uploadedImageSchema,
});

export type CategoryApiInput = z.input<typeof categoryApiSchema>;