import { z } from "zod";
import { imageFieldSchema, uploadedImageSchema } from "./category.schema";

export const contentSchema = z.object({
    type: z.enum([
        "banner",
        "hero_section",
        "featured_category",
        "featured_product",
        "section"
    ])
    .optional()
    .refine(val => !!val, {
        message: "Select content type"
    }),

    title: z.string().min(1, "Title is required"),

    description: z.string().optional(),

    image: imageFieldSchema
        .optional()
        .refine((val) => !!val, "Content image is required"),

    link_url: z.string().optional(),

    priority: z.coerce
        .number()
        .int("Priority must be a whole number")
        .min(0, "Priority must be 0 or greater")
        .max(999, "Priority must be under 999")
        .default(0),
});

// Homepage intro section: heading + description only
export const homeIntroSchema = z.object({
    title: z.string().trim().min(1, "Heading is required").max(120, "Heading must be under 120 characters"),
    description: z.string().trim().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
});

export type HomeIntroFormValues = z.infer<typeof homeIntroSchema>;

export const contentApiSchema = contentSchema.extend({
  image: uploadedImageSchema,
});