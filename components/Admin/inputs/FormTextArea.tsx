"use client";

import { Typography } from "@/components/ui/Typography";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils";

type FormTextareaProps<T extends FieldValues> = {
  name?: Path<T>;
  control?: Control<T>;
  label?: string;
  placeholder?: string;
  className?: string;

  // fallback (non-RHF)
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  rows?: number;
};

const AdminFormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  value,
  onChange,
  error: externalError,
  rows = 4,
}: FormTextareaProps<T>) => {
  
  const controller =
    name && control ? useController({ name, control }) : null;

  const field = controller?.field;
  const error = controller?.fieldState.error?.message || externalError;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <Typography variant="body">
          {label}
        </Typography>
      )}

      <textarea
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-grayBorder bg-transparent px-2.5 py-2 text-sm outline-none transition-colors resize-none",
          "hover:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30",
          error && "border-red-500 focus-visible:ring-red-300",
          className
        )}
        {...(field
          ? field
          : {
              value,
              onChange: (e: any) => onChange?.(e.target.value),
            })}
      />

      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default AdminFormTextarea;