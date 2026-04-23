"use client";

import { AlertTriangle, X } from "lucide-react";

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all dark:border dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Delete Purchase Order?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                This will permanently remove the saved purchase order from local storage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-gray-200 px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-11 rounded-xl bg-rose-600 px-6 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Purchase Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
