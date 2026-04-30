"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { DesignationFormData } from "@/lib/validations/masterSchemas";
import DesignationForm from "@/components/masters-forms/DesignationForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: DesignationFormData) => {
    try {
      setSubmitting(true);
      await createMaster("designation", form as any);
      toast.success("Designation created.");
      router.push("/DesignationMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <DesignationForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/DesignationMaster")} submitting={submitting} />
    </div>
  );
}
