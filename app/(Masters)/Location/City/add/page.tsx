"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCityMaster } from "@/hooks/useMasters";
import type { CityFormData } from "@/lib/validations/masterSchemas";
import CityForm from "@/components/masters-forms/CityForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { states, isLoading } = useCityMaster();

  const handleSubmit = async (form: CityFormData) => {
    try {
      setSubmitting(true);
      await entityCall("city", "insert", { ...form, CityId: "0" } as any);
      toast.success("City created.");
      router.push("/Location/City");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;

  return <CityForm data={null} states={states || []} onSubmit={handleSubmit} onCancel={() => router.push("/Location/City")} submitting={submitting} />;
}
