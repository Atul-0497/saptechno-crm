"use client";

import React from "react";
import { Power, Pencil, Trash2, Loader2 } from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import clsx from "clsx";

export interface ColumnConfig {
  key: string;
  label: string;
  /** "status" renders a colored badge, "actions" is auto-added */
  type?: "text" | "status" | "custom";
  /** Custom render fn overrides default cell rendering */
  render?: (row: any) => React.ReactNode;
  width?: string;
}

interface UniversalTableProps {
  columns: ColumnConfig[];
  data: any[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (row: any) => void;
  /** Key name used for the row ID (default: "Id") */
  idKey?: string;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        active
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-rose-500")} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function UniversalTable({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onToggleActive,
  idKey = "Id",
}: UniversalTableProps) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-600">
        <span className="text-4xl">🗄️</span>
        <p className="text-sm font-semibold">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-violet-50/40 to-blue-50/60 dark:border-slate-800 dark:bg-transparent">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/70 dark:text-slate-500"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-right text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/70 dark:text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-indigo-50/80 dark:divide-slate-800/50">
          {data.map((row, i) => {
            const rowId = String(row[idKey] ?? row.Id ?? i);
            const isActive = isMasterActive(row.Active);

            return (
              <tr
                key={rowId}
                className="group transition-colors hover:bg-indigo-50/60 dark:hover:bg-slate-800/30"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    {col.render ? (
                      col.render(row)
                    ) : col.type === "status" ? (
                      <StatusBadge active={isMasterActive(row[col.key])} />
                    ) : (
                      <span className="truncate">{row[col.key] ?? "—"}</span>
                    )}
                  </td>
                ))}

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {onToggleActive && (
                      <button
                        title={isActive ? "Deactivate" : "Activate"}
                        onClick={() => onToggleActive(row)}
                        className={clsx(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                          isActive
                            ? "text-emerald-500 hover:bg-emerald-500/10"
                            : "text-slate-400 hover:bg-slate-500/10"
                        )}
                      >
                        <Power size={14} />
                      </button>
                    )}

                    {onEdit && (
                      <button
                        title="Edit"
                        onClick={() => onEdit(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-all hover:bg-blue-500/10"
                      >
                        <Pencil size={14} />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        title="Delete"
                        onClick={() => onDelete(rowId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-all hover:bg-rose-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
