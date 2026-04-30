"use client";


import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDepartmentMaster } from "@/hooks/useMasters";
import DepartmentForm from "@/components/masters-forms/DepartmentForm";
import type { DepartmentFormData } from "@/lib/validations/masterSchemas";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: departments, isLoading } = useDepartmentMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => {
    return (departments || []).find((r) => String(r.DepartmentId || r.Id) === id) || null;
  }, [departments, id]);

  const handleSubmit = async (form: DepartmentFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await entityCall("department", "update", { ...form, Id: id } as any);
      toast.success("Department updated.");
      router.push("/DepartmentMaster");
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
        <button onClick={() => router.push("/DepartmentMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DepartmentForm data={editing} onSubmit={handleSubmit} onCancel={() => router.push("/DepartmentMaster")} submitting={submitting} />
    </div>
  );
}
