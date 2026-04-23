"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocationMaster } from "@/app/hooks/useMasters";
import { type LocationFormData } from "@/app/lib/validations/masterSchemas";
import LocationForm from "../../components/LocationForm";
import { useMemo } from "react";


export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { countries: locations, isLoading, country: { update } } = useLocationMaster();

  const editing = useMemo(() => {
    return (locations || []).find(r => String((r as any).LocationId || r.Id) === id) || null;
  }, [locations, id]);

  const handleSubmit = async (form: LocationFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, Id: id } as any);
      toast.success("Location updated.");
      router.push("/Location");
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
          onClick={() => router.push("/Location")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <LocationForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location")}
        submitting={update.isPending}
      />
    </div>
  );
}
