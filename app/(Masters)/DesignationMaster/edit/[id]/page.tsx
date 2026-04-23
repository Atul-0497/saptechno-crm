"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDesignationMaster } from "@/app/hooks/useMasters";
import { type DesignationFormData } from "@/app/lib/validations/masterSchemas";
import DesignationForm from "../../components/DesignationForm";
import { useMemo } from "react";
import type { DesignationRecord } from "@/app/types/master";

export default function EditDesignationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: designations, isLoading, update } = useDesignationMaster();

  const editing = useMemo(() => {
    return (designations || []).find(r => String(r.DesignationId || r.Id) === id) || null;
  }, [designations, id]);

  const handleSubmit = async (form: DesignationFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, Id: id } as any);
      toast.success("Designation updated.");
      router.push("/DesignationMaster");
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
          onClick={() => router.push("/DesignationMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DesignationForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/DesignationMaster")}
        submitting={update.isPending}
      />
    </div>
  );
}
