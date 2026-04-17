"use client";

import {
  Building2,
  CheckCircle2,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { SimpleMasterRecord } from "@/app/types/master";

type DepartmentTableProps = {
  data: SimpleMasterRecord[];
  loading: boolean;
  onEdit: (dept: SimpleMasterRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (dept: SimpleMasterRecord) => void | Promise<void>;
};

export default function DepartmentTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: DepartmentTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Department
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Code
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 4 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((dept) => {
                const isActive = isMasterActive(dept.Active);

                return (
                  <tr key={dept.Id} className="transition hover:bg-cyan-50/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase">
                          {(dept.Name || "D")[0]}
                        </div>
                        <div className="font-semibold text-gray-950">{dept.Name || "Untitled department"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {dept.Code || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleActive(dept)}
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(dept)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(dept.Id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-gray-100 lg:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ))}

        {!loading &&
          data.map((dept) => {
            const isActive = isMasterActive(dept.Active);

            return (
              <article key={dept.Id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase">
                      {(dept.Name || "D")[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950">{dept.Name || "Untitled department"}</h3>
                      <p className="font-mono text-xs text-gray-500">{dept.Code || "No code"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(dept)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(dept)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(dept.Id)}
                    className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Building2 size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950">No departments found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your first department or adjust your search filter.
          </p>
        </div>
      )}
    </div>
  );
}
