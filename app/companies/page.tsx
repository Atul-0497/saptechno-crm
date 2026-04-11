"use client";

import { useState } from "react";
import { useCompany } from "@/app/hooks/useCompany";
import { Company } from "@/app/types/company";
import CompanyTable from "./components/CompanyTable";
import CompanyModal from "./components/CompanyModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import toast from "react-hot-toast";
import { CompanyForm } from "@/app/lib/schema/company.schema";

export default function CompaniesPage() {
  const { data, isLoading, create, update, remove } = useCompany();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ➕ ADD
  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  // ✏️ EDIT
  const handleEdit = (company: Company) => {
    setEditing(company);
    setOpen(true);
  };

  // 💾 SUBMIT
  const handleSubmit = async (form: CompanyForm) => {
    try {
      if (editing) {
        await update.mutateAsync({
          ...form,
          CompanyId: editing.CompanyId,
        });
        toast.success("Data updated successfully");
      } else {
        await create.mutateAsync(form);
        toast.success("Company created successfully");
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  // ❌ DELETE SINGLE
  const handleDeleteClick = (id: string) => {
    setDeleteIds([id]);
  };

  // ❌ BULK DELETE
  const handleBulkDelete = (ids: string[]) => {
    setDeleteIds(ids);
  };

  // 🔥 CONFIRM DELETE
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);

      await Promise.all(deleteIds.map((id) => remove.mutateAsync(id)));

      toast.success("Deleted successfully");
      setDeleteIds([]);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-gray-500 text-sm">
            Manage all your companies
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          + Add Company
        </button>
      </div>

      {/* TABLE */}
      <CompanyTable
        data={data}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onBulkDelete={handleBulkDelete}
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={deleteIds.length > 0}
        onClose={() => setDeleteIds([])}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      {/* FORM MODAL */}
      <CompanyModal
        open={open}
        data={editing}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />

    </div>
  );
}