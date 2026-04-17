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
      <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-950 text-left">Delete industry?</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 text-left">
                This will remove the industry sector from the master catalog. This cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete industry"}
          </button>
        </div>
      </div>
    </div>
  );
}
