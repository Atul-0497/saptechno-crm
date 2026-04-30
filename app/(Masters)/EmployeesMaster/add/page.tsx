"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [submitting, setSubmitting] = useState(false);
  const { data: employees } = useEmployeeMaster();
  const { data: departments } = useDepartmentMaster();
  const { data: designations } = useDesignationMaster();

  const handleSubmit = async (form: EmployeeFormData) => {
    try {
      setSubmitting(true);
      await createMaster("employee", form as any);
      toast.success("Employee onboarding successful.");
      router.push("/EmployeesMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <EmployeeForm
        data={null}
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
