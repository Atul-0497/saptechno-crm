"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocationMaster } from "@/hooks/useMasters";
import type { VendorFormData } from "@/lib/validations/masterSchemas";
import VendorForm from "@/components/masters-forms/VendorForm";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const { cities } = useLocationMaster();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: VendorFormData) => {
    try {
      setSubmitting(true);
      await entityCall("vendor", "insert", form as any);
      toast.success("Vendor profile created.");
      router.push("/VendorMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <VendorForm
        data={null}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/VendorMaster")}
        submitting={submitting}
      />
    </div>
  );
}
