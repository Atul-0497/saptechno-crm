"use client";

import {
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  Truck,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { VendorRecord, CityRecord } from "@/app/types/master";

type VendorTableProps = {
  data: VendorRecord[];
  cities: CityRecord[];
  loading: boolean;
  onEdit: (vendor: VendorRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (vendor: VendorRecord) => void | Promise<void>;
};

export default function VendorTable({
  data,
  cities,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: VendorTableProps) {
  const getCityName = (id?: string) =>
    cities.find((c) => String(c.CityId ?? c.Id) === String(id))?.CityName ?? "—";

  const getInitials = (name?: string) =>
    (name || "Vendor")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "VN";

  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/80 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Vendor
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Contact
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Location
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
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((vendor) => {
                const isActive = isMasterActive(vendor.Active);

                return (
                  <tr key={vendor.Id} className="transition hover:bg-cyan-50/30 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase dark:bg-slate-800 dark:text-slate-200">
                          {getInitials(vendor.VendorName)}
                        </div>
                        <div className="font-semibold text-gray-950 dark:text-white">{vendor.VendorName || "Untitled vendor"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                          <Mail size={14} className="text-gray-400 dark:text-slate-500" />
                          <span>{vendor.Email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                          <Phone size={14} className="text-gray-400 dark:text-slate-500" />
                          <span>{vendor.Mobile || "—"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                        <MapPin size={16} className="mt-0.5 text-gray-400 dark:text-slate-500" />
                        <div>
                          <div className="font-medium">{getCityName(vendor.CityId)}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 max-w-[180px] truncate">{vendor.Address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleActive(vendor)}
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
                          onClick={() => onEdit(vendor)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-cyan-400"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(vendor.Id ?? "")}
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

      <div className="divide-y divide-gray-100 lg:hidden dark:divide-slate-800">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            </div>
          ))}

        {!loading &&
          data.map((vendor) => {
            const isActive = isMasterActive(vendor.Active);

            return (
              <article key={vendor.Id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase dark:bg-slate-800 dark:text-slate-200">
                      {getInitials(vendor.VendorName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950 dark:text-white">{vendor.VendorName || "Untitled vendor"}</h3>
                      <p className="truncate text-sm text-gray-500 dark:text-slate-400">{vendor.Email || "No email"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(vendor)}
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

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400">Mobile</div>
                    <div className="mt-1 truncate text-gray-800 dark:text-slate-200">{vendor.Mobile || "—"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400">City</div>
                    <div className="mt-1 truncate text-gray-800 dark:text-slate-200">{getCityName(vendor.CityId)}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                   <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-slate-700 dark:text-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vendor.Id ?? "")}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-900/20 dark:text-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
            <Truck size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">No vendors found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-slate-400">
            Add your first vendor record to start managing your suppliers.
          </p>
        </div>
      )}
    </div>
  );
}
