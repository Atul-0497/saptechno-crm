"use client";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <p>Delete this company?</p>

        <div className="flex gap-2 mt-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}