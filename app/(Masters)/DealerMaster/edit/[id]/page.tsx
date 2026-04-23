"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDealerMaster, useLocationMaster } from "@/app/hooks/useMasters";
import { type DealerFormData } from "@/app/lib/validations/masterSchemas";
import DealerForm from "../../components/DealerForm";
import { useMemo } from "react";
import type { DealerRecord } from "@/app/types/master";

export default function EditDealerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: dealers, isLoading, update } = useDealerMaster();
  const { cities } = useLocationMaster();

  const editing = useMemo(() => {
    return (dealers || []).find(r => String(r.DealerId || r.Id) === id) || null;
  }, [dealers, id]);

  const handleSubmit = async (form: DealerFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, DealerId: id } as any);
      toast.success("Dealer updated.");
      router.push("/DealerMaster");
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
          onClick={() => router.push("/DealerMaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DealerForm
        data={editing}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/DealerMaster")}
        submitting={update.isPending}
      />
    </div>
  );
}
