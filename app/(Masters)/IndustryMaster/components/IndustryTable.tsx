"use client";

import {
  Factory,
  Pencil,
  Trash2,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { IndustryRecord } from "@/app/types/master";

type IndustryTableProps = {
  data: IndustryRecord[];
  loading: boolean;
  onEdit: (item: IndustryRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: IndustryRecord) => void | Promise<void>;
};

export default function IndustryTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: IndustryTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block text-left">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/80 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Industry Sector
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-800 dark:bg-transparent">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 3 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((item) => {
                const isActive = isMasterActive(item.Active);
                const itemId = String(item.IndustryId ?? item.Id);

                return (
                  <tr key={itemId} className="transition hover:bg-cyan-50/30 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase dark:bg-slate-800 dark:text-slate-200">
                          {(item.Name || "I")[0]}
                        </div>
                        <div className="font-semibold text-gray-950 dark:text-white text-left">{item.Name || "Untitled industry"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <button
                        onClick={() => onToggleActive(item)}
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-cyan-400"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(itemId)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
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

      <div className="divide-y divide-gray-100 lg:hidden text-left dark:divide-slate-800 text-left">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800 text-left" />
            </div>
          ))}

        {!loading &&
          data.map((item) => {
            const isActive = isMasterActive(item.Active);
            const itemId = String(item.IndustryId ?? item.Id);

            return (
              <article key={itemId} className="p-4 text-left">
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase dark:bg-slate-800 dark:text-slate-200">
                      {(item.Name || "I")[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950 dark:text-white">{item.Name || "Untitled industry"}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(item)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                        : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-slate-700 dark:text-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(itemId)}
                    className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-900/20 dark:text-rose-400"
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
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
            <Factory size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">No industries found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-slate-400">
            Add your first industry sector to help categorize your clients and leads.
          </p>
        </div>
      )}
    </div>
  );
}
