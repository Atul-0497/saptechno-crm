"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateMaster } from "@/app/hooks/useMasters";
import { type StateFormData } from "@/app/lib/validations/masterSchemas";
import StateForm from "../../components/StateForm";
import { useMemo } from "react";
import type { StateRecord } from "@/app/types/master";

export default function EditStatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { countries, data: states, isLoading, update } = useStateMaster();

  const editing = useMemo(() => {
    return (states || []).find(r => String(r.StateId || r.Id) === id) || null;
  }, [states, id]);

  const handleSubmit = async (form: StateFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, StateId: id } as any);
      toast.success("State updated.");
      router.push("/Location/State");
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
          onClick={() => router.push("/Location/State")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <StateForm
        data={editing}
        countries={countries}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/State")}
        submitting={update.isPending}
      />
    </div>
  );
}
