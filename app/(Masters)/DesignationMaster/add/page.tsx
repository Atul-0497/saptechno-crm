"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { DesignationFormData } from "@/lib/validations/masterSchemas";
import DesignationForm from "@/components/masters-forms/DesignationForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: DesignationFormData) => {
    try {
      setSubmitting(true);
      await entityCall("designation", "insert", form as any);
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
