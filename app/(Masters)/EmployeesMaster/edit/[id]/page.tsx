"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useEmployeeMaster,
  useDepartmentMaster,
  useDesignationMaster,
} from "@/hooks/useMasters";
import type { EmployeeFormData } from "@/lib/validations/masterSchemas";
import EmployeeForm from "@/components/masters/EmployeeForm";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: employees, isLoading } = useEmployeeMaster();
  const { data: departments } = useDepartmentMaster();
  const { data: designations } = useDesignationMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => {
    return (employees || []).find((r) => String(r.EmployeeId || r.Id) === id) || null;
  }, [employees, id]);

  const handleSubmit = async (form: EmployeeFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("employee", id, form as any);
      toast.success("Staff profile updated.");
      router.push("/EmployeesMaster");
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
        <button onClick={() => router.push("/EmployeesMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <EmployeeForm
        data={editing}
        departments={departments || []}
        designations={designations || []}
        employees={employees || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/EmployeesMaster")}
        submitting={submitting}
      />
    </div>
  );
}
