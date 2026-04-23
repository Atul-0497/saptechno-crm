"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCityMaster } from "@/app/hooks/useMasters";
import { type CityFormData } from "@/app/lib/validations/masterSchemas";
import CityForm from "../../components/CityForm";
import { useMemo } from "react";
import type { CityRecord } from "@/app/types/master";

export default function EditCityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { states, data: cities, isLoading, update } = useCityMaster();

  const editing = useMemo(() => {
    return (cities || []).find(r => String(r.CityId || r.Id) === id) || null;
  }, [cities, id]);

  const handleSubmit = async (form: CityFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, CityId: id } as any);
      toast.success("City updated.");
      router.push("/Location/City");
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
          onClick={() => router.push("/Location/City")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CityForm
        data={editing}
        states={states}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/City")}
        submitting={update.isPending}
      />
    </div>
  );
}
