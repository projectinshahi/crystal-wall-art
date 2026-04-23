"use client";

import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

type PendingImage = {
  __pendingFile: File;
  __folder: string;
  previewUrl: string;        // blob URL for display
};

type UploadedImage = {
  url: string;
  public_id: string;
};

// Field value is either a pending file, an uploaded image, or arrays of both
type SingleValue = PendingImage | UploadedImage | undefined;
type MultipleValue = (PendingImage | UploadedImage)[];

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  folder?: string;
  required?: boolean;
  multiple?: boolean;
};

// ── type guards ──────────────────────────────────────────────
const isPending = (v: unknown): v is PendingImage =>
  !!v && typeof v === "object" && "__pendingFile" in v;

const isUploaded = (v: unknown): v is UploadedImage =>
  !!v && typeof v === "object" && "url" in v && "public_id" in v;

const getDisplayUrl = (item: PendingImage | UploadedImage): string =>
  isPending(item) ? item.previewUrl : item.url;

const getId = (item: PendingImage | UploadedImage): string =>
  isPending(item) ? item.previewUrl : item.public_id;

// ─────────────────────────────────────────────────────────────

const AdminImageUpload = <T extends FieldValues>({
  name,
  control,
  label,
  folder = "general",
  required = false,
  multiple = false,
}: Props<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const inputRef = useRef<HTMLInputElement>(null);

  // Track blob URLs so we can revoke them
  const blobsRef = useRef<Set<string>>(new Set());

  const revoke = (url: string) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      blobsRef.current.delete(url);
    }
  };

  // Revoke all blobs on unmount
  useEffect(() => {
    return () => blobsRef.current.forEach(revoke);
  }, []);

  // ── helpers ──────────────────────────────────────────────

  const toArray = (v: unknown): (PendingImage | UploadedImage)[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (isPending(v) || isUploaded(v)) return [v];
    return [];
  };

  // ── single mode ──────────────────────────────────────────

  const handleSelectSingle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous blob if any
    const prev = value as SingleValue;
    if (isPending(prev)) revoke(prev.previewUrl);

    const previewUrl = URL.createObjectURL(file);
    blobsRef.current.add(previewUrl);

    onChange({ __pendingFile: file, __folder: folder, previewUrl } satisfies PendingImage);
    e.target.value = "";
  };

  const handleRemoveSingle = () => {
    const prev = value as SingleValue;
    if (isPending(prev)) revoke(prev.previewUrl);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── multiple mode ────────────────────────────────────────

  const handleSelectMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newItems: PendingImage[] = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      blobsRef.current.add(previewUrl);
      return { __pendingFile: file, __folder: folder, previewUrl };
    });

    const prev = toArray(value);
    onChange([...prev, ...newItems] satisfies MultipleValue);
    e.target.value = "";
  };

  const handleRemoveMultiple = (id: string) => {
    const prev = toArray(value);
    const target = prev.find((item) => getId(item) === id);
    if (target && isPending(target)) revoke(target.previewUrl);

    const next = prev.filter((item) => getId(item) !== id);
    onChange(next.length ? next : undefined);
  };

  // ── render ───────────────────────────────────────────────

  if (multiple) {
    const items = toArray(value);

    return (
      <div className="space-y-2">
        {label && (
          <Typography variant="body">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Typography>
        )}

        {/* Grid preview */}
        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <div key={getId(item)} className="relative group aspect-square">
                <img
                  src={getDisplayUrl(item)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMultiple(getId(item))}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload trigger */}
        <label className={cn(
          "flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg cursor-pointer hover:bg-muted",
          error && "border-red-500"
        )}>
          <Upload className="h-4 w-4" />
          {items.length > 0 ? "Add More" : "Choose Images"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelectMultiple}
          />
          {error && (
            <p className="text-xs text-red-500">{error.message}</p>
          )}
        </label>
      </div>
    );
  }

  // Single mode
  const single = value as SingleValue;
  const displayUrl = isPending(single)
    ? single.previewUrl
    : isUploaded(single)
      ? single.url
      : null;

  return (
    <div className="space-y-2">
      {label && (
        <Typography variant="body">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
      )}

      {displayUrl ? (
        <div className="relative group w-full">
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded border"
          />
          <button
            type="button"
            onClick={handleRemoveSingle}
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className={cn(
          "flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg cursor-pointer hover:bg-muted",
          error && "border-red-500"
        )}>
          <Upload className="h-4 w-4" />
          Choose Image
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectSingle}
          />
        </label>
      )}
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default AdminImageUpload;