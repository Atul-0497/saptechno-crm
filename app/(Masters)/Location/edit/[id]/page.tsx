"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocationMaster } from "@/hooks/useMasters";
import LocationForm from "@/components/masters/LocationForm";
import type { LocationFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { countries: locations, isLoading } = useLocationMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => {
    return (locations || []).find((r: any) => String(r.LocationId || r.Id) === id) || null;
  }, [locations, id]);

  const handleSubmit = async (form: LocationFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("country", id, { ...form, Id: id } as any);
      toast.success("Location updated.");
      router.push("/Location");
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
        <button onClick={() => router.push("/Location")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <LocationForm data={editing} onSubmit={handleSubmit} onCancel={() => router.push("/Location")} submitting={submitting} />
    </div>
  );
}
