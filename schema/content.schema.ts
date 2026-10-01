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

    // Hero only: image shown on mobile/tablet. Required for hero_section (see contentFormSchema + API checks)
    mobile_image: imageFieldSchema.nullable().optional(),

    link_url: z.string().optional(),

    priority: z.coerce
        .number()
        .int("Priority must be a whole number")
        .min(0, "Priority must be 0 or greater")
        .max(999, "Priority must be under 999")
        .default(0),
});

export const HERO_MOBILE_IMAGE_REQUIRED = "Mobile banner image is required for Hero Section";

// Admin content form: a Hero Section must have a mobile banner (the API enforces the same rule).
// Kept separate from contentSchema, which is extended into contentApiSchema.
export const contentFormSchema = contentSchema.superRefine((val, ctx) => {
    if (val.type === "hero_section" && !val.mobile_image) {
        ctx.addIssue({ code: "custom", path: ["mobile_image"], message: HERO_MOBILE_IMAGE_REQUIRED });
    }
});

// Homepage intro section: heading + description only
export const homeIntroSchema = z.object({
    title: z.string().trim().min(1, "Heading is required").max(120, "Heading must be under 120 characters"),
    description: z.string().trim().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
});

export type HomeIntroFormValues = z.infer<typeof homeIntroSchema>;

export const contentApiSchema = contentSchema.extend({
  image: uploadedImageSchema,
  mobile_image: uploadedImageSchema.nullable().optional(),
});