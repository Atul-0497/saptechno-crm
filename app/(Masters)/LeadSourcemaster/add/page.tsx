"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { LeadSourceFormData } from "@/lib/validations/masterSchemas";
import LeadSourceForm from "@/components/masters/LeadSourceForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: LeadSourceFormData) => {
    try {
      setSubmitting(true);
      await createMaster("leadsource", form as any);
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
