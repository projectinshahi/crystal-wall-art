"use client";

import React from "react";
import {
  Control,
  useController,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Typography } from "@/components/ui/Typography";

type Option = {
  label: string;
  value: string;
};

type FormSelectProps<T extends FieldValues> = {
  name?: Path<T>;
  control?: Control<T>;

  label?: string;
  placeholder?: string;

  options: Option[];

  className?: string;

  value?: string;
  onChange?: (value: string) => void;

  error?: string;
  required?: boolean;
};

const AdminFormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  className,
  value,
  onChange,
  error: externalError,
  required,
}: FormSelectProps<T>) => {
  const controller =
    name && control ? useController({ name, control }) : null;

  const field = controller?.field;

  const error =
    controller?.fieldState.error?.message || externalError;

  const selectedValue = field ? field.value : value;

  const handleChange = (val: string) => {
    if (field) {
      field.onChange(val);
    } else {
      onChange?.(val);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <Typography variant="body">
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Typography>
      )}

      {/* Select */}
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger
          className={`w-full rounded-lg bg-transparent ${
            error ? "border-red-500" : ""
          } ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Error */}
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default AdminFormSelect;