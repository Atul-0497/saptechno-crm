"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCountryMaster } from "@/app/hooks/useMasters";
import { type CountryFormData } from "@/app/lib/validations/masterSchemas";
import CountryForm from "../../components/CountryForm";
import { useMemo } from "react";
import type { CountryRecord } from "@/app/types/master";

export default function EditCountryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: countries, isLoading, update } = useCountryMaster();

  const editing = useMemo(() => {
    return (countries || []).find(r => String(r.CountryId || r.Id) === id) || null;
  }, [countries, id]);

  const handleSubmit = async (form: CountryFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, CountryId: id } as any);
      toast.success("Country updated.");
      router.push("/Location/Country");
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
          onClick={() => router.push("/Location/Country")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CountryForm
        data={editing}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/Country")}
        submitting={update.isPending}
      />
    </div>
  );
}
