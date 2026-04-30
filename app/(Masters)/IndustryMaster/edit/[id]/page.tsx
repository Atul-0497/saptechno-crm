"use client";


import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useIndustryMaster } from "@/hooks/useMasters";
import IndustryForm from "@/components/masters-forms/IndustryForm";
import type { IndustryFormData } from "@/lib/validations/masterSchemas";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: items, isLoading } = useIndustryMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => (items || []).find((r) => String((r as any).Id || (r as any).IndustryId) === id) || null, [items, id]);

  const handleSubmit = async (form: IndustryFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await entityCall("industry", "update", { ...form, Id: id } as any);
      toast.success("Industry updated.");
      router.push("/IndustryMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  if (!editing) return (<div className="p-8 text-center"><h2 className="text-xl font-bold">Record not found</h2><button onClick={() => router.push("/IndustryMaster")} className="mt-4 text-blue-500">Return</button></div>);

  return <div className="p-8"><IndustryForm data={editing} onSubmit={handleSubmit} onCancel={() => router.push("/IndustryMaster")} submitting={submitting} /></div>;
}
