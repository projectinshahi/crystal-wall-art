import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const orientationEnum = z.enum(["portrait", "landscape", "square"]);
export type Orientation = z.infer<typeof orientationEnum>;

export const productStatusEnum = z.enum(["draft", "active", "inactive"]);
export type ProductStatus = z.infer<typeof productStatusEnum>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const imageUrlSchema = z
  .string()
  .url("Invalid image URL")
  .refine(
    (url) =>
      /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(url) ||
      url.includes("cloudinary.com"),
    "Must be a valid image URL"
  );

export const productSchema = z
  .object({
    // Basic Info
    title: z.string().min(2, "Title must be at least 2 characters").max(120).trim(),
    description: z.string().max(2000).trim(),
    category: z.string().min(1, "Subcategory is required"),

    // Pricing — cast to ZodType<number> so TypeScript sees `number`, not `unknown`
    price: z.coerce.number().positive("Price must be greater than 0") as z.ZodType<number>,

    discount_price: z.coerce
      .number()
      .min(0, "Discount price must be 0 or greater")
      .optional() as z.ZodType<number | undefined>,

    stock_quantity: z.coerce
      .number()
      .int("Stock quantity must be a whole number")
      .min(0, "Stock must be 0 or greater") as z.ZodType<number>,

    // Tag arrays
    sizes: z.array(z.string().min(1).trim()).optional().default([]),
    thickness: z.array(z.string().min(1).trim()).optional().default([]),
    mounting_methods: z.array(z.string().min(1).trim()).optional().default([]),

    // Multi-select
    orientation: z.array(orientationEnum),

    // Status
    status: productStatusEnum.default("draft"),

    // Image
    images: z
      .array(
        z.object({
          url: z.string().optional(),
          previewUrl: z.string().optional(),
        })
      )
      .min(1, "At least one image is required") // ✅ BEFORE transform
      .transform((imgs) =>
        imgs
          .map((img) => img.url || img.previewUrl)
          .filter(Boolean)
      )
      .refine((arr) => arr.length > 0, {
        message: "At least one valid image is required",
      }),
    thumbnail: z.string().url(),

    // Optional image per size label: pending upload or an existing {url, public_id}
    size_images: z.record(z.string(), z.any()).optional().default({}),
  })
  .refine(
    (data) => data.discount_price === undefined || data.discount_price < data.price,
    {
      message: "Discount price must be less than the original price",
      path: ["discount_price"],
    }
  );

// A size image in the form: a newly picked file, or an existing uploaded image
export type SizeImageValue =
  | { __pendingFile: File; previewUrl: string }
  | { url: string; public_id?: string };

type ImageValue = {
  previewUrl?: string;
  url?: string;
  public_id?: string;
};

// ─── Explicit type — bypasses Zod's broken inference for coerce fields ────────

export type ProductFormValues = {
  title: string;
  description: string;
  category: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  sizes: string[];
  thickness: string[];
  mounting_methods: string[];
  orientation: ("portrait" | "landscape" | "square")[];
  status: "draft" | "active" | "inactive";
  images?: ImageValue[];
  thumbnail: string;
  size_images?: Record<string, SizeImageValue | null>;
};

// ─── Default Values ───────────────────────────────────────────────────────────

export const productDefaultValues: ProductFormValues = {
  title: "",
  description: "",
  category: "",
  price: 0,
  discount_price: undefined,
  stock_quantity: 0,
  sizes: [],
  thickness: [],
  mounting_methods: [],
  orientation: [],
  status: "draft",
  images: [],
  thumbnail: "",
  size_images: {}
};

// ─── Per-Step Field Keys ──────────────────────────────────────────────────────

export const productStepFields: Record<string, (keyof ProductFormValues)[]> = {
  details: [
    "title", "description", "category",
    "price", "discount_price", "stock_quantity",
    "sizes", "thickness", "mounting_methods",
    "orientation", "status",
  ],
  images: ["images"],
};