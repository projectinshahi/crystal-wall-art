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
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  rows?: number;
};

const ControlledTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  error: externalError,
  rows = 4,
}: Required<Pick<FormTextareaProps<T>, "name" | "control">> &
  Omit<FormTextareaProps<T>, "name" | "control" | "value" | "onChange">) => {
  const { field, fieldState } = useController({ name, control });
  const error = fieldState.error?.message || externalError;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <Typography variant="caption" className="font-medium text-black">
          {label}
        </Typography>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-grayBorder bg-white px-2.5 py-2 text-sm outline-none transition-colors resize-none",
          "hover:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30",
          error && "border-red-500 focus-visible:ring-red-300",
          className
        )}
        {...field}
        value={field.value ?? ""}   // ✅ null → empty string
      />
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  value,
  onChange,
  error,
  rows = 4,
}: FormTextareaProps<T>) => {
  // RHF mode
  if (name && control) {
    return (
      <ControlledTextarea
        name={name}
        control={control}
        label={label}
        placeholder={placeholder}
        className={className}
        error={error}
        rows={rows}
      />
    );
  }

  // Uncontrolled / external mode
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <Typography variant="caption" className="font-medium text-black">
          {label}
        </Typography>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-grayBorder bg-white px-2.5 py-2 text-sm outline-none transition-colors resize-none",
          "hover:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30",
          error && "border-red-500 focus-visible:ring-red-300",
          className
        )}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default FormTextarea;