"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/hooks/useMasters";
import VendorForm from "@/components/masters/VendorForm";
import type { VendorFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: vendors, isLoading } = useVendorMaster();
  const { cities } = useLocationMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => {
    return (vendors || []).find((r) => String(r.VendorId || r.Id) === id) || null;
  }, [vendors, id]);

  const handleSubmit = async (form: VendorFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("vendor", id, form as any);
      toast.success("Vendor profile updated.");
      router.push("/VendorMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  if (!editing && !isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Record not found</h2>
        <button onClick={() => router.push("/VendorMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <VendorForm
        data={editing}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/VendorMaster")}
        submitting={submitting}
      />
    </div>
  );
}
