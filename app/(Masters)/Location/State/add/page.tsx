"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { StateFormData } from "@/lib/validations/masterSchemas";
import StateForm from "@/components/masters/StateForm";
import { useCountryMaster } from "@/hooks/useMasters";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: countries } = useCountryMaster();

  const handleSubmit = async (form: StateFormData) => {
    try {
      setSubmitting(true);
      await createMaster("state", form as any);
      toast.success("State created.");
      router.push("/Location/State");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return <StateForm data={null} countries={countries || []} onSubmit={handleSubmit} onCancel={() => router.push("/Location/State")} submitting={submitting} />;
}
