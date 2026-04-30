"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { LeadSourceFormData } from "@/lib/validations/masterSchemas";
import LeadSourceForm from "@/components/masters-forms/LeadSourceForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: LeadSourceFormData) => {
    try {
      setSubmitting(true);
      await entityCall("leadsource", "insert", form as any);
      toast.success("Lead source created.");
      router.push("/LeadSourcemaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return <LeadSourceForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/LeadSourcemaster")} submitting={submitting} />;
}
