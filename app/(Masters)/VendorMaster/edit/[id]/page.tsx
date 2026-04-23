"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/app/hooks/useMasters";
import { type VendorFormData } from "@/app/lib/validations/masterSchemas";
import VendorForm from "../../components/VendorForm";
import { useMemo } from "react";
import type { VendorRecord } from "@/app/types/master";

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: vendors, isLoading, update } = useVendorMaster();
  const { cities } = useLocationMaster();

  const editing = useMemo(() => {
    return (vendors || []).find(r => String(r.VendorId || r.Id) === id) || null;
  }, [vendors, id]);

  const handleSubmit = async (form: VendorFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, VendorId: id } as any);
      toast.success("Vendor profile updated.");
      router.push("/VendorMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to update record.");
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
        <button 
          onClick={() => router.push("/VendorMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
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
        submitting={update.isPending}
      />
    </div>
  );
}
