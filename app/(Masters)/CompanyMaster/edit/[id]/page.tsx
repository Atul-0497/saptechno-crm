"use client";


import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { masterKeys, useCompanyMaster } from "@/hooks/useMasters";
import CompanyForm from "@/components/masters-forms/CompanyForm";
import type { CompanyFormData } from "@/lib/validations/masterSchemas";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useCompanyMaster();
  const [submitting, setSubmitting] = useState(false);
  const records = data || [];

  const editing = useMemo(() => {
    return records.find((r) => String(r.CompanyId || r.Id) === id) || null;
  }, [records, id]);

  const handleSubmit = async (form: CompanyFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await entityCall("company", "update", { ...form, Id: id } as any);
      toast.success("Company profile updated.");
      router.push("/CompanyMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
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
        <button onClick={() => router.push("/CompanyMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CompanyForm data={editing} onSubmit={handleSubmit} onCancel={() => router.push("/CompanyMaster")} submitting={submitting} />
    </div>
  );
}
