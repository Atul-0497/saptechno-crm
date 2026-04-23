"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLeadSourceMaster } from "@/app/hooks/useMasters";
import { type LeadSourceFormData } from "@/app/lib/validations/masterSchemas";
import LeadSourceForm from "../../components/LeadSourceForm";
import { useMemo } from "react";
import type { LeadSourceRecord } from "@/app/types/master";

export default function EditLeadSourcePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: sources, isLoading, update } = useLeadSourceMaster();

  const editing = useMemo(() => {
    return (sources || []).find(r => String(r.LeadSourceId || r.Id) === id) || null;
  }, [sources, id]);

  const handleSubmit = async (form: LeadSourceFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, Id: id } as any);
      toast.success("Lead source updated.");
      router.push("/LeadSourcemaster");
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
          onClick={() => router.push("/LeadSourcemaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <LeadSourceForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/LeadSourcemaster")}
        submitting={update.isPending}
      />
    </div>
  );
}
