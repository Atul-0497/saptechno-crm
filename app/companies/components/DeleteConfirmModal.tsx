"use client";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  title = "Delete Company",
  description = "Are you sure you want to delete this company? This action cannot be undone.",
  onClose,
  onConfirm,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <div className="bg-white w-[95%] max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-200">

        {/* ICON */}
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xl">
            !
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-center text-lg font-semibold">
          {title}
        </h3>

        {/* DESC */}
        <p className="text-center text-sm text-gray-500">
          {description}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 pt-2">

          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-black"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
}