"use client";

import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import type { PurchaseOrderRecord } from "@/app/types/purchaseOrder";

type PurchaseOrderTableProps = {
  data: PurchaseOrderRecord[];
  loading: boolean;
  onEdit: (item: PurchaseOrderRecord) => void;
  onDelete: (id: string) => void;
};

function formatCurrency(value: string | number | undefined) {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(numeric);
}

export default function PurchaseOrderTable({
  data,
  loading,
  onEdit,
  onDelete,
}: PurchaseOrderTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/80 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Purchase Order</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Vendor</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Dates</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Value</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Status</th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-800 dark:bg-transparent">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-[130px] animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((item) => (
                <tr key={item.id} className="group transition hover:bg-blue-50/30 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-slate-800">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-950 dark:text-white">{item.purchaseTitle}</div>
                        <div className="mt-1 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-slate-400">
                          {item.purchaseNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm font-medium text-gray-700 dark:text-slate-300">{item.vendorName || "Unknown Vendor"}</td>
                  <td className="px-5 py-5 text-sm text-gray-600 dark:text-slate-400">
                    <div>{item.purchaseDate}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Delivery {item.expectedDeliveryDate}
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm font-black text-gray-950 dark:text-white">
                    {formatCurrency(item.grandTotal)}
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-tight text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-900/20 dark:text-blue-300">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="flex h-9 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <Pencil size={14} />
                        EDIT
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-gray-100 lg:hidden dark:divide-slate-800">
        {!loading &&
          data.map((item) => (
            <article key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-950 dark:text-white">{item.purchaseTitle}</h3>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400">
                    {item.purchaseNumber}
                  </p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">{item.vendorName || "Unknown Vendor"}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {item.status}
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Grand Total</p>
                  <p className="mt-1 text-lg font-black text-gray-950 dark:text-white">{formatCurrency(item.grandTotal)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-xl border border-gray-200 bg-white p-2 text-rose-600 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
            <ClipboardList size={28} />
          </div>
          <h3 className="mt-6 text-lg font-black uppercase tracking-tight text-gray-950 dark:text-white">No purchase orders found</h3>
          <p className="mt-2 max-w-xs text-sm font-medium text-gray-500 dark:text-slate-400">
            Add your first purchase order to start tracking vendor procurement.
          </p>
        </div>
      )}
    </div>
  );
}
