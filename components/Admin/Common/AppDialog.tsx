"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

interface AppDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;

    title?: string;
    description?: string;

    trigger?: React.ReactNode;

    content?: React.ReactNode;
    footer?: React.ReactNode;

    showHeader?: boolean;
    className?: string;
    showClose?: boolean;
    disableOutsideClose?: boolean;
}

export default function AppDialog({
    open,
    onOpenChange,
    title,
    description,
    trigger,
    content,
    footer,
    showHeader = true,
    className = "",
    showClose = true,
    disableOutsideClose = false,
}: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            {/* Trigger */}
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent
                onInteractOutside={(e) => {
                    if (disableOutsideClose) e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    if (disableOutsideClose) e.preventDefault();
                }}
                className={`sm:max-w-md p-0 gap-0 ${!showClose ? "[&>button]:hidden" : ""}${className}`}
            >
                {/* Header */}
                {showHeader && (title || description) && (
                    <div className="px-6 py-4">
                        <DialogHeader className="flex flex-col gap-1">
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && (
                                <DialogDescription>{description}</DialogDescription>
                            )}
                        </DialogHeader>
                    </div>
                )}

                {/* Divider */}
                {(title || description) && (
                    <div className="border-t border-border" />
                )}

                {/* Content */}
                {content && (
                    <div className="px-6 py-4">
                        {content}
                    </div>
                )}

                {/* Footer */}
                {footer && (
                    <DialogFooter className="px-6 py-4 m-0">
                        <div className="flex justify-end gap-2 w-full">
                            {footer}
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}