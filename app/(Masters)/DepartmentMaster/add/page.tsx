"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { masterKeys } from "@/hooks/useMasters";
import type { DepartmentFormData } from "@/lib/validations/masterSchemas";
import DepartmentForm from "@/components/masters-forms/DepartmentForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: DepartmentFormData) => {
    try {
      setSubmitting(true);
      await createMaster("department", form as any);
      toast.success("Department created.");
      router.push("/DepartmentMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <DepartmentForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/DepartmentMaster")} submitting={submitting} />
    </div>
  );
}
