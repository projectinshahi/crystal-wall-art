"use client";

import React from "react";
import {
  Control,
  useController,
  FieldValues,
  Path,
} from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/Typography";

type Option = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  name?: Path<T>;
  control?: Control<T>;

  label?: string;
  placeholder?: string;

  options: Option[];

  className?: string;

  value?: string[];
  onChange?: (value: string[]) => void;

  error?: string;
  required?: boolean;
};

const AdminMultiSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select options",
  options,
  className,
  value,
  onChange,
  error: externalError,
  required,
}: Props<T>) => {
  const controller =
    name && control ? useController({ name, control }) : null;

  const field = controller?.field;

  const error =
    controller?.fieldState.error?.message || externalError;

  const selected: string[] = field
    ? field.value || []
    : value || [];

  const handleChange = (val: string) => {
    let updated: string[];

    if (selected.includes(val)) {
      updated = selected.filter((v) => v !== val);
    } else {
      updated = [...selected, val];
    }

    if (field) {
      field.onChange(updated);
    } else {
      onChange?.(updated);
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

      {/* Trigger */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`justify-between w-full ${className}`}
          >
            {selected.length > 0
              ? `${selected.length} selected`
              : placeholder}
          </Button>
        </PopoverTrigger>

        {/* Dropdown */}
        <PopoverContent className="w-full p-2">
          <div className="flex flex-col gap-2 max-h-60 overflow-auto">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(opt.value)}
                  onCheckedChange={() =>
                    handleChange(opt.value)
                  }
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Error */}
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default AdminMultiSelect;