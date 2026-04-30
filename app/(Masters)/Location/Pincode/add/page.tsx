"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCountryMaster, useStateMaster, useCityMaster } from "@/hooks/useMasters";
import type { PincodeFormData } from "@/lib/validations/masterSchemas";
import PincodeForm from "@/components/masters-forms/PincodeForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: countries } = useCountryMaster();
  const { data: states } = useStateMaster();
  const { data: cities } = useCityMaster();

  const handleSubmit = async (form: PincodeFormData) => {
    try {
      setSubmitting(true);
      await entityCall("pincode", "insert", { ...form, PincodeId: "0" } as any);
      toast.success("Pin Code created.");
      router.push("/Location/Pincode");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PincodeForm
      data={null}
      countries={countries || []}
      states={states || []}
      cities={cities || []}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/Location/Pincode")}
      submitting={submitting}
    />
  );
}
