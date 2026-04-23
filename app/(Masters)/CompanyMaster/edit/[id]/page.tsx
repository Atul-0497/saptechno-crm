"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCompanyMaster } from "@/app/hooks/useMasters";
import { type CompanyFormData } from "@/app/lib/validations/masterSchemas";
import CompanyForm from "../../components/CompanyForm";
import { useMemo } from "react";
import type { CompanyRecord } from "@/app/types/master";

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data, isLoading, update } = useCompanyMaster();
  const records: CompanyRecord[] = data || [];

  const editing = useMemo(() => {
    return records.find(r => String(r.CompanyId || r.Id) === id) || null;
  }, [records, id]);

  const handleSubmit = async (form: CompanyFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, CompanyId: id } as any);
      toast.success("Company profile updated.");
      router.push("/CompanyMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to update record.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  if (!editing && !isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Record not found</h2>
        <button 
          onClick={() => router.push("/CompanyMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CompanyForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/CompanyMaster")}
        submitting={update.isPending}
      />
    </div>
  );
}
