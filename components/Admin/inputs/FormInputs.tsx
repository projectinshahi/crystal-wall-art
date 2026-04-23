"use client";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/Typography";
import { Control, useController, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    name?: Path<T>;
    control?: Control<T>;
    label?: string;
    placeholder?: string;
    type?: string;
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    required?: boolean
};

const AdminFormInput = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    type = "text",
    className,
    value,
    onChange,
    error: externalError,
    required
}: FormInputProps<T>) => {

    const controller = name && control
        ? useController({ name, control })
        : null;

    const field = controller?.field;
    const error = controller?.fieldState.error?.message || externalError;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <Typography variant="body">
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </Typography>
            )}

            <Input
                type={type}
                placeholder={placeholder}
                className={`rounded-lg bg-transparent ${error ? "border-red-500" : ""
                    } ${className}`}

                // 👇 RHF OR normal fallback
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

export default AdminFormInput;