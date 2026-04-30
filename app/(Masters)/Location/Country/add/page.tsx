"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { CountryFormData } from "@/lib/validations/masterSchemas";
import CountryForm from "@/components/masters/CountryForm";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: CountryFormData) => {
    try {
      setSubmitting(true);
      // existing API expected CountryId: "0" for new countries
      await createMaster("country", { ...form, CountryId: "0" } as any);
      toast.success("Country created.");
      router.push("/Location/Country");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return <CountryForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/Location/Country")} submitting={submitting} />;
}
