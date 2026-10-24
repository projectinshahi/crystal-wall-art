"use client";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Typography } from "@/components/ui/Typography";
import { ProductVideoValue } from "@/schema/product.schema";
import { MAX_PRODUCT_VIDEO_SIZE, PRODUCT_VIDEO_TYPES } from "@/lib/utils/media";

// Keep in sync with MAX_PRODUCT_VIDEOS in lib/productVideos.ts (server-only module)
const MAX_VIDEOS = 5;

type Props = {
  value: ProductVideoValue[];
  onChange: (next: ProductVideoValue[]) => void;
};

const previewOf = (v: ProductVideoValue) => ("previewUrl" in v ? v.previewUrl : v.url);

// Optional product videos; shown after the images in the product page gallery
export default function ProductVideosField({ value, onChange }: Props) {
  const remove = (index: number) => {
    const target = value[index];
    if ("previewUrl" in target) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((_, i) => i !== index));
  };

  const add = (files: File[]) => {
    const next = [...value];
    for (const file of files) {
      if (next.length >= MAX_VIDEOS) {
        toast.error(`A product can have at most ${MAX_VIDEOS} videos`);
        break;
      }
      if (!PRODUCT_VIDEO_TYPES.includes(file.type)) {
        toast.error(`"${file.name}": use MP4, WebM or MOV`);
        continue;
      }
      if (file.size > MAX_PRODUCT_VIDEO_SIZE) {
        toast.error(`"${file.name}": video must be 50MB or smaller`);
        continue;
      }
      next.push({ __pendingFile: file, previewUrl: URL.createObjectURL(file) });
    }
    onChange(next);
  };

  return (
    <div className="space-y-3 pt-2">
      <div>
        <Typography variant="body" className="font-medium">Product videos (optional)</Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          Shown after the images on the product page. MP4, WebM or MOV, up to 50MB each, at most {MAX_VIDEOS} videos.
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((video, i) => (
          <div key={previewOf(video)} className="relative aspect-square rounded-xl border overflow-hidden bg-black">
            <video src={previewOf(video)} className="h-full w-full object-cover" muted loop autoPlay playsInline />
            {"previewUrl" in video && (
              <span className="absolute bottom-1 left-1 text-[10px] px-2 py-0.5 bg-black/60 text-white rounded">
                Uploads on save
              </span>
            )}
            <button
              type="button"
              aria-label={`Remove video ${i + 1}`}
              onClick={() => remove(i)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {value.length < MAX_VIDEOS && (
          <label className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed cursor-pointer hover:bg-muted text-xs text-muted-foreground">
            <Upload className="h-4 w-4" />
            Add Video
            <input
              type="file"
              accept={PRODUCT_VIDEO_TYPES.join(",")}
              multiple
              className="hidden"
              aria-label="Add product video"
              onChange={(e) => {
                add(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
