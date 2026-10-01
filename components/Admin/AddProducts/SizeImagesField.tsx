"use client";

import { Upload, X } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { SizeImageValue } from "@/schema/product.schema";

type Props = {
  sizes: string[];
  value: Record<string, SizeImageValue | null>;
  onChange: (next: Record<string, SizeImageValue | null>) => void;
};

const previewOf = (v?: SizeImageValue | null) => (!v ? "" : "previewUrl" in v ? v.previewUrl : v.url);

// One optional image per size; shown on the product page when the customer selects that size
export default function SizeImagesField({ sizes, value, onChange }: Props) {
  if (!sizes.length) return null;

  const set = (size: string, next: SizeImageValue | null) => {
    const prev = value[size];
    if (prev && "previewUrl" in prev) URL.revokeObjectURL(prev.previewUrl);
    onChange({ ...value, [size]: next });
  };

  return (
    <div className="space-y-3 pt-2">
      <div>
        <Typography variant="body" className="font-medium">Size images (optional)</Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          Shown on the product page when the customer selects that size.
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sizes.map((size) => {
          const url = previewOf(value[size]);

          return (
            <div key={size} className="space-y-1">
              <p className="text-sm font-medium truncate">{size}</p>

              {url ? (
                <div className="relative aspect-square rounded-xl border overflow-hidden">
                  <img src={url} alt={`Size ${size}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label={`Remove image for size ${size}`}
                    onClick={() => set(size, null)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed cursor-pointer hover:bg-muted text-xs text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label={`Image for size ${size}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set(size, { __pendingFile: file, previewUrl: URL.createObjectURL(file) });
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
