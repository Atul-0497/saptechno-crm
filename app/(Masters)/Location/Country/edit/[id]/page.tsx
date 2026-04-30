"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCountryMaster } from "@/hooks/useMasters";
import CountryForm from "@/components/masters/CountryForm";
import type { CountryFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: items, isLoading } = useCountryMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => (items || []).find((r) => String((r as any).CountryId || (r as any).Id) === id) || null, [items, id]);

  const handleSubmit = async (form: CountryFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("country", id, form as any);
      toast.success("Country updated.");
      router.push("/Location/Country");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  if (!editing) return (<div className="p-8 text-center"><h2 className="text-xl font-bold">Record not found</h2><button onClick={() => router.push("/Location/Country")} className="mt-4 text-blue-500">Return</button></div>);

  return <div className="p-8"><CountryForm data={editing} onSubmit={handleSubmit} onCancel={() => router.push("/Location/Country")} submitting={submitting} /></div>;
}
