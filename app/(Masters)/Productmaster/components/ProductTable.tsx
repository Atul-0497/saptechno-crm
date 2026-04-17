"use client";

import {
  Package,
  Pencil,
  Trash2,
  Tag,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { ProductRecord } from "@/app/types/master";

type ProductTableProps = {
  data: ProductRecord[];
  loading: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: ProductRecord) => void | Promise<void>;
};

export default function ProductTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductTableProps) {
  const formatPrice = (price?: number | string) => {
    const p = typeof price === "string" ? parseFloat(price) : price;
    if (p === undefined || isNaN(p)) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(p);
  };

  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Product
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Code
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price
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
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((item) => {
                const isActive = isMasterActive(item.Active);

                return (
                  <tr key={item.Id} className="transition hover:bg-cyan-50/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase">
                          {(item.ProductName || "P")[0]}
                        </div>
                        <div className="font-semibold text-gray-950">{item.ProductName || "Untitled product"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item.ProductCode || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Tag size={14} className="text-gray-400" />
                        {formatPrice(item.Price)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleActive(item)}
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
                          onClick={() => onEdit(item)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(item.Id ?? "")}
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
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ))}

        {!loading &&
          data.map((item) => {
            const isActive = isMasterActive(item.Active);

            return (
              <article key={item.Id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white uppercase">
                      {(item.ProductName || "P")[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950">{item.ProductName || "Untitled product"}</h3>
                      <p className="font-mono text-xs text-gray-500">{item.ProductCode || "No code"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(item)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                   <div className="text-sm font-semibold text-gray-900">{formatPrice(item.Price)}</div>
                   <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.Id ?? "")}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
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
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Package size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950">No products found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your first product to start cataloging your inventory.
          </p>
        </div>
      )}
    </div>
  );
}
