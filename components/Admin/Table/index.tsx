"use client";

import React, { useCallback, useState } from "react";
import { CustomTable, ColumnDef } from "./CustomTable";
import AdminPagination from "../ProductPage/TableData/AdminPagination";
import { PaginationMeta } from "@/lib/db/content.db";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

// ─── 1. Define your row shape ───────────────────────────────────────────────
// Replace with your actual type. `any[]` loses all type safety.
interface RowData {
    id: string;
    [key: string]: unknown;
}

// ─── 2. Define what actions each row can trigger ────────────────────────────
// Add/remove as needed. This is the contract between DataTable and its parent.
interface RowActions<T> {
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    // add more: onDuplicate, onExport, etc.
}

interface Props<T extends RowData> {
    data: T[];
    columns: ColumnDef<T>[];          // columns come from outside — table stays generic
    meta?: PaginationMeta;
    onPageChange?: (page: number) => void;
    rowActions?: RowActions<T>;        // all row-level callbacks passed as one object
    emptyState?: string;
}

// ─── 3. DataTable — owns selection, delegates everything else ───────────────
export function DataTable<T extends RowData>({
    data,
    columns,
    meta,
    onPageChange,
    rowActions,
    emptyState = "No data found.",
}: Props<T>) {

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Select all / deselect all
    const handleSelectAll = useCallback(
        (checked: boolean) => {
            setSelectedIds(checked ? new Set(data.map((row) => row.id)) : new Set());
        },
        [data]
    );

    // Toggle a single row
    const handleSelectRow = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    // ─── 4. Inject action buttons into columns if rowActions provided ──────────
    // We append an "actions" column automatically — callers don't build it manually.
    const resolvedColumns: ColumnDef<T>[] = rowActions
        ? [
            ...columns,
            {
                key: "__actions__",
                header: "Action",
                headerClassName: "text-right w-[100px]",
                className: "text-right",
                cell: (row) => <RowActionButtons row={row} actions={rowActions} />,
            },
        ]
        : columns;

    return (
        <div className="space-y-4">
            <CustomTable
                data={data}
                columns={resolvedColumns}
                getRowKey={(row) => row.id}
                selectable
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                emptyState={emptyState}
            />

            <AdminPagination
                currentPage={meta ? meta.page : 1}
                totalItems={meta ? meta.total : 0}
                pageSize={meta ? meta.limit : 0}
                onPageChange={onPageChange ?? (() => { })}
            />
        </div>
    );
}

// ─── 5. Action buttons cell — isolated, row-aware ───────────────────────────

interface RowActionButtonsProps<T> {
    row: T;
    actions: RowActions<T>;
}

function RowActionButtons<T>({ row, actions }: RowActionButtonsProps<T>) {
    return (
        <div className="flex items-center justify-end gap-1">
            {actions.onView && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => actions.onView!(row)}
                    aria-label="View"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )}
            {actions.onEdit && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => actions.onEdit!(row)}
                    aria-label="Edit"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            )}
            {actions.onDelete && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => actions.onDelete!(row)}
                    aria-label="Delete"
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            )}
        </div>
    );
}