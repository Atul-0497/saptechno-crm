"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { LocationFormData } from "@/lib/validations/masterSchemas";
import LocationForm from "@/components/masters/LocationForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: LocationFormData) => {
    try {
      setSubmitting(true);
      await createMaster("country", form as any);
      toast.success("Location created.");
      router.push("/Location");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <LocationForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/Location")} submitting={submitting} />
    </div>
  );
}
