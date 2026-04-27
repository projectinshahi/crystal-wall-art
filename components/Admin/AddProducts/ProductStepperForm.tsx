"use client";

import React, { useEffect, useState } from "react";
import AppTabs, { TabItem } from "../Common/AppTabs";
import { useForm, Control } from "react-hook-form";
import {
  ProductFormValues,
  productSchema,
  productDefaultValues,
  productStepFields,
} from "@/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminFormInput from "../inputs/FormInputs";
import AdminFormSelect from "../inputs/FormSelect";
import AdminFormTextarea from "../inputs/FormTextArea";
import AdminFormTagInput from "../inputs/FormTagInput";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import AdminImageUpload from "../inputs/ImageUpload";
import SucessScreen from "./SucessScreen";
import { CategoryTypes } from "@/types/Admin/categories.types";
import { toast } from "sonner";
import { blobUrlToBase64 } from "@/lib/utils/imageUtils";

export const ORIENTATION = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "square", label: "Square" }
]

// ─── Types ────────────────────────────────────────────────────────────────────
type SubmitState = "idle" | "loading" | "success" | "error";

// Lock all three generics so Control<ProductFormValues, any, ProductFormValues>
// is what flows into every child — no TFieldValues mismatch.
type ProductControl = Control<ProductFormValues, any, ProductFormValues>;

const getImageUrl = (img: any) => {
  if (!img) return "";
  if ("previewUrl" in img) return img.previewUrl; // pending
  if ("url" in img) return img.url; // uploaded
  return "";
};

export type Variant = {
  id?: string;
  size: string;
  thickness: string;
  price: number;
  discount_price: number | null;
  orientation: string;
  stock_quantity: number;
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProductStepperForm = () => {
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedOrientations, setSelectedOrientations] = useState<
    ProductFormValues["orientations"]
  >([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);

  // Provide all three generics explicitly:
  //   useForm<TFieldValues, TContext, TTransformedValues>
  // By setting TTransformedValues = ProductFormValues, the resolver's output
  // type is pinned and Control's third generic resolves to ProductFormValues.
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    // @ts-ignore
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: productDefaultValues,
  });

  // Cast once here — every AdminForm* component receives ProductControl
  const typedControl = control as ProductControl;

  // ── Orientation toggle ───────────────────────────────────────────────────────
  const toggleOrientation = (
    value: ProductFormValues["orientations"][number]
  ) => {
    const updated: ProductFormValues["orientations"] =
      selectedOrientations.includes(value)
        ? selectedOrientations.filter((o) => o !== value)
        : [...selectedOrientations, value];

    setSelectedOrientations(updated);
    setValue("orientations", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const watchedSizes = watch("sizes");
  const watchedThicknesses = watch("thicknesses");
  const watchedPrice = watch("price");
  const watchedImages = watch("images") || [];
  const watchedThumbnail = watch("thumbnail");

  // -- Generate Variants
  const generateVariants = () => {
    if (watchedSizes.length === 0 && watchedThicknesses.length === 0) {
      setVariants(prev => [...prev, { size: "", thickness: "", price: Number(watchedPrice) || 0, discount_price: null, orientation: '', stock_quantity: 0 }]);
      return;
    }
    const sizes = watchedSizes.length > 0 ? watchedSizes : [""];
    const thicks = watchedThicknesses.length > 0 ? watchedThicknesses : [""];
    const newVariants: Variant[] = [];
    for (const s of sizes) {
      for (const t of thicks) {
        if (!variants.find(v => v.size === s && v.thickness === t)) {
          newVariants.push({ size: s, thickness: t, price: Number(watchedPrice) || 0, discount_price: null, orientation: '', stock_quantity: 0 });
        }
      }
    }
    setVariants(prev => [...prev, ...newVariants]);
  };

  // ── Step content ─────────────────────────────────────────────────────────────
  const detailsContent = (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <AdminFormInput
          name="title"
          control={typedControl}
          label="Title"
          required
        />
        <AdminFormSelect
          name="category"
          control={typedControl}
          label="Category"
          required
          options={categories as any}
        />
      </div>

      <AdminFormTextarea
        name="description"
        control={typedControl}
        label="Description"
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <AdminFormInput
          name="price"
          control={typedControl}
          label="Price (₹)"
          required
          type="number"
        />
        <AdminFormInput
          name="discount_price"
          control={typedControl}
          label="Discount Price (₹)"
          type="number"
        />
        <AdminFormInput
          name="stock_quantity"
          control={typedControl}
          label="Stock Quantity"
          required
          type="number"
        />
      </div>

      <AdminFormTagInput
        name="sizes"
        control={typedControl}
        label="Sizes (e.g. 8×6, 12×8, 12×15)"
        placeholder="Type a size and press Enter"
      />
      <AdminFormTagInput
        name="thicknesses"
        control={typedControl}
        label="Thicknesses (e.g. 3mm, 5mm, 10mm)"
        placeholder="Type a thickness and press Enter"
      />
      <AdminFormTagInput
        name="mounting_methods"
        control={typedControl}
        label="Mounting Methods (e.g. Sticker, Studs, Hanging Hook)"
        placeholder="Type a method and press Enter"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 w-full">
          <Typography variant="body">
            Orientations
          </Typography>
          <div className="flex flex-wrap gap-2">
            {ORIENTATION.map((o) => {
              const selected = selectedOrientations.includes(o.value as any);
              return (
                <Button
                  key={o.value}
                  type="button"
                  variant="ghost"
                  onClick={() => toggleOrientation(o.value as any)}
                  className={`px-3 py-1.5 rounded-md border text-sm capitalize ${selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover:bg-accent"
                    }`}
                >
                  {o.label}
                </Button>
              );
            })}
          </div>
          {errors.orientations && (
            <p className="text-sm text-destructive mt-1">
              {errors.orientations.message as string}
            </p>
          )}
        </div>

        <AdminFormSelect
          name="status"
          control={typedControl}
          label="Status"
          required
          options={[
            { label: "Draft", value: "draft" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>
    </div>
  );

  const priceContent = (
    <div className="space-y-4">
      <Typography variant="body-sm" className="text-muted-foreground">Set different prices for size and thickness combinations. If no variants are defined, the base price is used.</Typography>

      {variants.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-4 text-center">
          No variants yet. Add sizes and thicknesses in Details tab first, then click "Generate Variants".
        </p>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_100px_100px_200px_80px_32px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>Size</span><span>Thickness</span><span>Price (₹)</span><span>Sale (₹)</span><span>Orientations</span><span>Stock</span><span />
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_100px_100px_200px_80px_32px] gap-2 items-center">

              <AdminFormInput
                value={v.size}
                className="h-8 text-sm"
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = { ...v, size: val };
                  setVariants(u);
                }}
              />

              <AdminFormInput
                value={v.thickness}
                className="h-8 text-sm"
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = { ...v, thickness: val };
                  setVariants(u);
                }}
              />

              <AdminFormInput
                type="number"
                value={v.price}
                className="h-8 text-sm"
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = { ...v, price: Number(val) };
                  setVariants(u);
                }}
              />

              <AdminFormInput
                type="number"
                value={v.discount_price ?? ""}
                className="h-8 text-sm"
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = {
                    ...v,
                    discount_price: val ? Number(val) : null,
                  };
                  setVariants(u);
                }}
              />

              <AdminFormSelect
                // name="orientation"
                control={typedControl}
                required
                options={ORIENTATION as any}
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = { ...v, orientation: val };
                  setVariants(u);
                }}
              />

              <AdminFormInput
                type="number"
                value={v.stock_quantity}
                className="h-8 text-sm"
                onChange={(val) => {
                  const u = [...variants];
                  u[i] = { ...v, stock_quantity: Number(val) };
                  setVariants(u);
                }}
              />

              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-8 w-8 text-destructive"
                onClick={() =>
                  setVariants(variants.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>

            </div>
          ))}
        </div>
      )}
    </div>
  );

  const imagesContent = (
    <div className="space-y-4">
      <Typography variant="body-sm" className="text-muted-foreground">
        Upload product photos that customers will see in the catalog.
      </Typography>

      {watchedImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {watchedImages.map((img, i) => {
            const url = getImageUrl(img);
            const isThumbnail = watchedThumbnail === url;

            return (
              <div
                key={i}
                className={`relative group rounded-xl border overflow-hidden ${isThumbnail ? "ring-2 ring-primary" : ""
                  }`}
              >
                {/* Image */}
                <div className="aspect-square">
                  <img
                    src={url}
                    alt={`Product ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Dark overlay — pointer-events-none so it never blocks clicks */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

                {/* Thumbnail Badge */}
                {isThumbnail && (
                  <div className="absolute top-1 left-1 text-[10px] px-2 py-0.5 bg-primary text-white rounded z-10">
                    Thumbnail
                  </div>
                )}

                {/* Delete button — top right, above overlay */}
                <button
                  type="button"
                  className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  onClick={() => {
                    const updated = watchedImages.filter((_, idx) => idx !== i);
                    setValue("images", updated);
                    if (isThumbnail) {
                      setValue(
                        "thumbnail",
                        updated[0] ? getImageUrl(updated[0]) : ""
                      );
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Set as Thumbnail button — bottom, above overlay */}
                <button
                  type="button"
                  onClick={() => setValue("thumbnail", url)}
                  className="absolute bottom-0 left-0 right-0 z-10 text-xs py-1.5 text-white bg-black/60 hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                >
                  {isThumbnail ? "✓ Thumbnail" : "Set as Thumbnail"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload */}
      <AdminImageUpload
        folder="product_images"
        name="images"
        control={control}
        multiple
        hideUploadedImages
      />
    </div>
  );

  // ── Steps ────────────────────────────────────────────────────────────────────
  const STEPS = [
    {
      id: "details", label: "Details", header: (
        <Typography variant="h4" className="font-bold underline underline-offset-4">Product Details</Typography>
      ),
      content: detailsContent
    },
    {
      id: "pricing", label: "Pricing", header: (
        <div className="flex items-center justify-between">
          <Typography variant="h4" className="font-bold underline underline-offset-4">Price Variants</Typography>
          <Button onClick={generateVariants}><Plus /> Generate Variants</Button>
        </div>
      ),
      content: priceContent
    },
    {
      id: "images", label: "Images", header: (
        <Typography variant="h4" className="font-bold underline underline-offset-4">Product Images</Typography>
      ),
      content: imagesContent
    },
  ] as const;

  // ── Navigation ───────────────────────────────────────────────────────────────
  const nextStep = async () => {
    const fields = productStepFields[STEPS[step].id] ?? [];
    const isValid = await trigger(fields);
    if (!isValid) return;
    if (step < STEPS.length - 1) setStep((p) => p + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep((p) => p - 1);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setSubmitState("loading");
      setSubmitError(null);

      // ── 1. Convert blob URLs → base64 data URIs ──────────────────────────
      const convertedImages = await Promise.all(
        (data.images as (File | string)[]).map(async (img, index) => {
          try {
            if (img instanceof File) return await fileToBase64(img);
            if (img.startsWith("blob:")) return await blobUrlToBase64(img);
            return img; // plain https:// URL (edit mode)
          } catch {
            throw new Error(`Failed to process image ${index + 1}. Please re-upload it.`);
          }
        })
      );

      async function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("FileReader failed"));
          reader.readAsDataURL(file);
        });
      }

      const convertedThumbnail = data.thumbnail?.startsWith("blob:")
        ? await blobUrlToBase64(data.thumbnail).catch(() => {
          throw new Error("Failed to process thumbnail. Please re-select it.");
        })
        : data.thumbnail;

      // ── 2. Build payload ─────────────────────────────────────────────────
      const payload = {
        title: data.title.trim(),
        category: data.category,
        description: data.description.trim(),
        price: data.price,
        discount_price: data.discount_price ?? null,
        stock_quantity: data.stock_quantity,
        sizes: data.sizes,
        thicknesses: data.thicknesses,
        mounting_methods: data.mounting_methods,
        orientations: data.orientations,
        status: data.status,
        images: convertedImages,
        thumbnail: convertedThumbnail,
      };

      // ── 3. Send to API ───────────────────────────────────────────────────
      let addProductRes: Response;
      try {
        addProductRes = await fetch("/api/admin/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_details: payload,
            product_variants: variants,
          }),
        });
      } catch {
        throw new Error("Network error: Unable to reach the server. Please check your connection.");
      }

      // ── 4. Parse response ────────────────────────────────────────────────
      let res: { success: boolean; message?: string; error?: string; productId?: string };
      try {
        res = await addProductRes.json();
      } catch {
        throw new Error(`Server error (${addProductRes.status}): Unexpected response format.`);
      }

      if (!addProductRes.ok || !res.success) {
        throw new Error(
          res.error ?? res.message ?? `Request failed with status ${addProductRes.status}.`
        );
      }

      // ── 5. Success ───────────────────────────────────────────────────────
      setSubmitState("success");
      toast.success("Product created successfully!");
      reset()

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("❌ Submission error:", err);
      setSubmitError(message);
      setSubmitState("error");
      toast.error(message);
    }
  };

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  const tabs: TabItem[] = STEPS.map((s, index) => ({
    value: s.id,
    label: s.label,
    header: s.header,
    disabled: index > step,
    content: s.content,
  }));

  const isLastStep = step === STEPS.length - 1;
  const isSubmitting = submitState === "loading";

  const handleReset = () => {
    reset();
    setStep(0);
    setSelectedOrientations([]);
    setSubmitState("idle");
  }

  useEffect(() => {
    if (!watchedImages.length) {
      // no images → clear thumbnail
      setValue("thumbnail", "");
      return;
    }

    const firstImageUrl = getImageUrl(watchedImages[0]);

    // ✅ set only if:
    // - no thumbnail yet OR
    // - thumbnail no longer exists (after delete)
    const thumbnailExists = watchedImages.some(
      (img) => getImageUrl(img) === watchedThumbnail
    );

    if (!watchedThumbnail || !thumbnailExists) {
      setValue("thumbnail", firstImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedImages]);

  const loadInitialData = async () => {
    const res = await fetch('/api/admin/category', { method: 'GET' });

    const data = await res.json();
    setCategories(
      data.data.map((item: CategoryTypes) => ({
        label: item.title,
        value: item.id,
      })) || []
    );
  }

  // Load Inital Data
  useEffect(() => {
    loadInitialData();
  }, []);

  // ── Success screen ───────────────────────────────────────────────────────────
  if (submitState === "success") return <SucessScreen handleReset={handleReset} />;

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4"
      noValidate
    >
      {submitState === "error" && submitError && (
        <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <strong>Submission failed:</strong> {submitError}
        </div>
      )}

      <AppTabs
        tabs={tabs}
        value={STEPS[step].id}
        onValueChange={(val) => {
          const index = STEPS.findIndex((s) => s.id === val);
          if (index <= step) setStep(index);
        }}
        fullWidth
        listClassName={`grid w-full grid-cols-${STEPS.length} !h-auto`}
      />

      <div className="flex justify-between items-center pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={step === 0 || isSubmitting}
        >
          Back
        </Button>

        {isLastStep ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        ) : (
          <Button type="button" onClick={nextStep} disabled={isSubmitting}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductStepperForm;