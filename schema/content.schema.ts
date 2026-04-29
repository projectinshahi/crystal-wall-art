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

export const contentApiSchema = contentSchema.extend({
  image: uploadedImageSchema,
});