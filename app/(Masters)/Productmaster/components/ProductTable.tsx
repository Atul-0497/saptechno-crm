"use client";

import {
  Package,
  Pencil,
  Trash2,
  Tag,
  Box,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { ProductRecord } from "@/app/types/master";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const getProductData = (item: ProductRecord) => {
    let price = 0;
    let unit = "";
    
    if (item.OtherInfoJson) {
      try {
        const parsed = JSON.parse(item.OtherInfoJson);
        price = parseFloat(parsed.unitPrice) || 0;
        unit = parsed.unit || "";
      } catch (e) {
        console.error("JSON parse error", e);
      }
    }
    
    return { price, unit };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/80 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Product Details
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Identification
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Pricing & Unit
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Control
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-800 dark:bg-transparent">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4 text-left">
                      <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-gray-100 dark:bg-slate-800 text-left" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((item) => {
                const isActive = isMasterActive(item.Active);
                const { price, unit } = getProductData(item);

                return (
                  <tr key={item.Id} className="group transition hover:bg-blue-50/30 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-5 text-left">
                      <div className="flex items-center gap-4 text-left">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 shadow-lg text-sm font-black text-white uppercase dark:bg-slate-800 dark:text-slate-200">
                          {(item.Name || "P")[0]}
                        </div>
                        <div className="font-bold text-gray-950 dark:text-white text-left">{item.Name || "Unnamed Product"}</div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-left">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-black text-gray-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        <Tag size={12} className="text-gray-400" />
                        {item.Code || "NO_CODE"}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-left">
                      <div className="space-y-1 text-left">
                        <div className="text-sm font-black text-gray-950 dark:text-white">{formatPrice(price)}</div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-500">
                          <Box size={12} />
                          Per {unit || "Unit"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-left">
                      <button
                        onClick={() => onToggleActive(item)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black tracking-tight transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-900/20 dark:text-rose-400"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                    <td className="px-5 py-5 text-left">
                      <div className="flex justify-end gap-2 text-left">
                        <button
                          onClick={() => onEdit(item)}
                          className="flex h-9 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:text-blue-400"
                        >
                          <Pencil size={14} />
                          EDIT
                        </button>
                        <button
                          onClick={() => onDelete(item.Id ?? "")}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:text-rose-400"
                        >
                          <Trash2 size={14} />
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
        {!loading &&
          data.map((item) => {
            const isActive = isMasterActive(item.Active);
            const { price, unit } = getProductData(item);

            return (
              <article key={item.Id} className="p-5 text-left">
                <div className="flex items-start justify-between gap-4 text-left">
                  <div className="flex min-w-0 items-center gap-4 text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-sm font-black text-white uppercase dark:bg-slate-800">
                      {(item.Name || "P")[0]}
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="truncate font-bold text-gray-950 dark:text-white text-left">{item.Name || "Unnamed Product"}</h3>
                      <p className="mt-1 text-xs font-black text-gray-500 uppercase tracking-widest dark:text-slate-400">{item.Code || "NO_CODE"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(item)}
                    className={`rounded-full px-3 py-1 text-[10px] font-black ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                        : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </button>
                </div>

                <div className="mt-5 flex items-end justify-between text-left">
                   <div className="text-left">
                     <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">MSRP PER {unit || "UNIT"}</p>
                     <p className="mt-1 text-lg font-black text-gray-950 dark:text-white">{formatPrice(price)}</p>
                   </div>
                   <div className="flex gap-2 text-left">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => onDelete(item.Id ?? "")}
                      className="rounded-xl border border-gray-200 bg-white p-2 text-rose-600 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <Package size={28} />
          </div>
          <h3 className="mt-6 text-lg font-black text-gray-950 dark:text-white uppercase tracking-tight">No products found</h3>
          <p className="mt-2 max-w-xs text-sm font-medium text-gray-500 dark:text-slate-400">
            Add your first item to the master catalog to begin quote operations.
          </p>
        </div>
      )}
    </div>
  );
}
