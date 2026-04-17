"use client";

import {
  Globe,
  Pencil,
  Trash2,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { CountryRecord } from "@/app/types/master";

type CountryTableProps = {
  data: CountryRecord[];
  loading: boolean;
  onEdit: (country: CountryRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (country: CountryRecord) => void | Promise<void>;
};

export default function CountryTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: CountryTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block text-left">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Country
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
                    <td key={cellIndex} className="px-5 py-4 text-left">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((country) => {
                const isActive = isMasterActive(country.Active);

                return (
                  <tr key={country.Id} className="transition hover:bg-cyan-50/30">
                    <td className="px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase font-bold">
                          {(country.CountryName || "C")[0]}
                        </div>
                        <div className="font-semibold text-gray-950 text-left">{country.CountryName || "Untitled country"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {country.CountryCode || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <button
                        onClick={() => onToggleActive(country)}
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(country)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 font-bold"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(String(country.CountryId ?? country.Id))}
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

      <div className="divide-y divide-gray-100 lg:hidden text-left">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-20 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ))}

        {!loading &&
          data.map((country) => {
            const isActive = isMasterActive(country.Active);

            return (
              <article key={country.Id} className="p-4 text-left">
                <div className="flex items-start justify-between gap-3 text-left text-left">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase font-bold">
                      {(country.CountryName || "C")[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950 font-bold">{country.CountryName || "Untitled country"}</h3>
                      <p className="text-xs text-gray-500 font-mono">{country.CountryCode || "Code N/A"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(country)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive ? "bg-emerald-50 text-emerald-700 font-bold" : "bg-rose-50 text-rose-700 font-bold"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(country)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 font-bold text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(String(country.CountryId ?? country.Id))}
                    className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 font-bold text-left"
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
            <Globe size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950 font-bold">No countries found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Define your global reach by adding countries here.
          </p>
        </div>
      )}
    </div>
  );
}
