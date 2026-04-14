"use client";

import { SetStateAction, useState } from "react";
import { useCompany } from "@/app/hooks/useCompany";
import CompanyTable from "./components/CompanyTable";
import CompanyModal from "./components/CompanyModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { Company } from "@/app/types/company";

export default function Page() {
  const { data, isLoading, create, update, remove } = useCompany();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔥 PAYLOAD BUILDER (VERY IMPORTANT)
  const buildPayload = (form: any, original?: any) => ({
    CompanyId: String(form.CompanyId || original?.CompanyId || ""),
    Name: form.Name ?? original?.Name ?? "",
    Address: form.Address ?? original?.Address ?? "",
    Email: form.Email ?? original?.Email ?? "",
    Mobile: form.Mobile ?? original?.Mobile ?? "",
    PlanStart:
      (form.PlanStart ?? original?.PlanStart)?.split("T")[0] || "",
    PlanEnd:
      (form.PlanEnd ?? original?.PlanEnd)?.split("T")[0] || "",
    Active:
      String(form.Active ?? original?.Active) === "1" ? "1" : "0",
  });

  // 💾 MODAL SUBMIT
  const handleSubmit = async (form: any) => {
    if (editing) {
      const original = data.find(
        (c: any) => c.CompanyId === editing.CompanyId
      );

      const payload = buildPayload(
        { ...form, CompanyId: editing.CompanyId },
        original
      );

      await update.mutateAsync(payload);
    } else {
      const payload = buildPayload(form);
      await create.mutateAsync(payload);
    }

    setOpen(false);
    setEditing(null);
  };

  // 🔥 INLINE UPDATE
  const handleInlineUpdate = async (updated: any) => {
    const original = data.find(
      (c: any) => c.CompanyId === updated.CompanyId
    );

    const payload = buildPayload(updated, original);

    await update.mutateAsync(payload);
  };

  // 🔥 TOGGLE
  const handleToggleActive = async (c: any) => {
    await handleInlineUpdate({
      ...c,
      Active: String(c.Active) === "1" ? "0" : "1",
    });
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    if (!deleteId) return;
    await remove.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-4">

      <button
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Company
      </button>

      <CompanyTable
        data={data}
        loading={isLoading}
        onEdit={(c: any) => {
          setEditing(c);
          setOpen(true);
        }}
        onDelete={(id: SetStateAction<string | null>) => setDeleteId(id)}
        onInlineUpdate={handleInlineUpdate}
        onToggleActive={handleToggleActive}
      />

      <CompanyModal
        open={open}
        data={editing}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}