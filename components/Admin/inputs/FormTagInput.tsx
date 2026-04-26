"use client";

import React, { useState, KeyboardEvent } from "react";
import {
    Control,
    useController,
    FieldValues,
    Path,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/Typography";
import { X } from "lucide-react";

type FormTagInputProps<T extends FieldValues> = {
    name?: Path<T>;
    control?: Control<T>;

    label?: string;
    placeholder?: string;

    className?: string;

    value?: string[];
    onChange?: (values: string[]) => void;

    error?: string;
    required?: boolean;

    maxTags?: number;
    disabled?: boolean;
};

const AdminFormTagInput = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder = "Type and press Enter",
    className,
    value,
    onChange,
    error: externalError,
    required,
    maxTags,
    disabled = false,
}: FormTagInputProps<T>) => {
    const [input, setInput] = useState("");

    const controller =
        name && control ? useController({ name, control }) : null;

    const field = controller?.field;

    const tags: string[] = field
        ? field.value || []
        : value || [];

    const error =
        controller?.fieldState.error?.message || externalError;

    const updateTags = (newTags: string[]) => {
        if (field) {
            field.onChange(newTags);
        } else {
            onChange?.(newTags);
        }
    };

    const addTag = () => {
        const trimmed = input.trim();

        if (!trimmed) return;

        if (tags.includes(trimmed)) {
            setInput("");
            return;
        }

        if (maxTags && tags.length >= maxTags) return;

        updateTags([...tags, trimmed]);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !input && tags.length > 0) {
            updateTags(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        if (disabled) return;
        updateTags(tags.filter((_, i) => i !== index));
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

            {/* Tag Input */}
            <div
                className={`flex flex-wrap items-center gap-1.5 p-2 rounded-md border min-h-[40px]
        ${error ? "border-red-500" : "border-input"}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}`}
            >
                {tags.map((tag, i) => (
                    <Badge
                        key={i}
                        variant="secondary"
                        className="gap-1 text-xs"
                    >
                        {tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeTag(i)}
                                className="ml-0.5 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </Badge>
                ))}

                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    disabled={disabled}
                    className={`rounded-lg bg-transparent ${error ? "border-red-500" : ""
                        } ${className}`}
                />
            </div>

            {/* Error */}
            {error && (
                <Typography variant="caption" className="text-red-500">
                    {error}
                </Typography>
            )}
        </div>
    );
};

export default AdminFormTagInput;