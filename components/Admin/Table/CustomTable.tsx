// components/ui/DataTable/DataTable.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => React.ReactNode;
}

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowKey: (row: T) => string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string) => void;
  emptyState?: React.ReactNode;
  className?: string;
}

export function CustomTable<T>({
  data,
  columns,
  getRowKey,
  selectable = false,
  selectedIds = new Set(),
  onSelectAll,
  onSelectRow,
  emptyState,
  className,
}: CustomTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(getRowKey(row)));
  const someSelected = data.some((row) => selectedIds.has(getRowKey(row)));

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "p-3 text-left text-sm font-medium text-muted-foreground",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-8 text-center text-muted-foreground"
                >
                  {emptyState ?? "No data found."}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = getRowKey(row);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-t transition-colors",
                      isSelected ? "bg-muted/40" : "hover:bg-muted/20"
                    )}
                  >
                    {selectable && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={isSelected}
                          onChange={() => onSelectRow?.(id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("p-3", col.className)}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}