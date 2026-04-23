"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useIndustryMaster } from "@/app/hooks/useMasters";
import { type IndustryFormData } from "@/app/lib/validations/masterSchemas";
import IndustryForm from "../../components/IndustryForm";
import { useMemo } from "react";
import type { IndustryRecord } from "@/app/types/master";

export default function EditIndustryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: industries, isLoading, update } = useIndustryMaster();

  const editing = useMemo(() => {
    return (industries || []).find(r => String(r.IndustryId || r.Id) === id) || null;
  }, [industries, id]);

  const handleSubmit = async (form: IndustryFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, Id: id } as any);
      toast.success("Industry updated.");
      router.push("/IndustryMaster");
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
          onClick={() => router.push("/IndustryMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <IndustryForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/IndustryMaster")}
        submitting={update.isPending}
      />
    </div>
  );
}
