"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { IndustryFormData } from "@/lib/validations/masterSchemas";
import IndustryForm from "@/components/masters-forms/IndustryForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: IndustryFormData) => {
    try {
      setSubmitting(true);
      await entityCall("industry", "insert", form as any);
      toast.success("Industry created.");
      router.push("/IndustryMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return <IndustryForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/IndustryMaster")} submitting={submitting} />;
}
