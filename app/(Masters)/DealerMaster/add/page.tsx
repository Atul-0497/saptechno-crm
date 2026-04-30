"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocationMaster } from "@/hooks/useMasters";
import type { DealerFormData } from "@/lib/validations/masterSchemas";
import DealerForm from "@/components/masters/DealerForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { cities } = useLocationMaster();

  const handleSubmit = async (form: DealerFormData) => {
    try {
      setSubmitting(true);
      await createMaster("dealer", form as any);
      toast.success("Dealer created.");
      router.push("/DealerMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <DealerForm data={null} cities={cities || []} onSubmit={handleSubmit} onCancel={() => router.push("/DealerMaster")} submitting={submitting} />
    </div>
  );
}
