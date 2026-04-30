"use client";


import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateMaster, useCountryMaster } from "@/hooks/useMasters";
import StateForm from "@/components/masters-forms/StateForm";
import type { StateFormData } from "@/lib/validations/masterSchemas";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: items, isLoading } = useStateMaster();
  const { data: countries } = useCountryMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => (items || []).find((r) => String((r as any).StateId || (r as any).Id) === id) || null, [items, id]);

  const handleSubmit = async (form: StateFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await entityCall("state", "update", { ...form, Id: id } as any);
      toast.success("State updated.");
      router.push("/Location/State");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  if (!editing) return (<div className="p-8 text-center"><h2 className="text-xl font-bold">Record not found</h2><button onClick={() => router.push("/Location/State")} className="mt-4 text-blue-500">Return</button></div>);

  return <div className="p-8"><StateForm data={editing} countries={countries || []} onSubmit={handleSubmit} onCancel={() => router.push("/Location/State")} submitting={submitting} /></div>;
}
