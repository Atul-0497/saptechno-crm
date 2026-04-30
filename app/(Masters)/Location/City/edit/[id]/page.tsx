"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCityMaster } from "@/hooks/useMasters";
import CityForm from "@/components/masters-forms/CityForm";
import type { CityFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { states, data: items, isLoading } = useCityMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => (items || []).find((r) => String((r as any).CityId || (r as any).Id) === id) || null, [items, id]);

  const handleSubmit = async (form: CityFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("city", id, form as any);
      toast.success("City updated.");
      router.push("/Location/City");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  if (!editing) return (<div className="p-8 text-center"><h2 className="text-xl font-bold">Record not found</h2><button onClick={() => router.push("/Location/City")} className="mt-4 text-blue-500">Return</button></div>);

  return <div className="p-8"><CityForm data={editing} states={states || []} onSubmit={handleSubmit} onCancel={() => router.push("/Location/City")} submitting={submitting} /></div>;
}
