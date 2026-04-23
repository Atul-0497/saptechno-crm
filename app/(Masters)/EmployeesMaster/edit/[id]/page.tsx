"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  useEmployeeMaster, 
  useDepartmentMaster, 
  useDesignationMaster 
} from "@/app/hooks/useMasters";
import { type EmployeeFormData } from "@/app/lib/validations/masterSchemas";
import EmployeeForm from "../../components/EmployeeForm";
import { useMemo } from "react";
import type { EmployeeRecord } from "@/app/types/master";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: employees, isLoading, update } = useEmployeeMaster();
  const { data: departments } = useDepartmentMaster();
  const { data: designations } = useDesignationMaster();

  const editing = useMemo(() => {
    return (employees || []).find(r => String(r.EmployeeId || r.Id) === id) || null;
  }, [employees, id]);

  const handleSubmit = async (form: EmployeeFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, EmployeeId: id } as any);
      toast.success("Staff profile updated.");
      router.push("/EmployeesMaster");
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
          onClick={() => router.push("/EmployeesMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
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
        submitting={update.isPending}
      />
    </div>
  );
}
