"use client";

import { updateMaster } from "@/actions/masters";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { usePincodeMaster, useCountryMaster, useStateMaster, useCityMaster } from "@/hooks/useMasters";
import PincodeForm from "@/components/masters/PincodeForm";
import type { PincodeFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: countries } = useCountryMaster();
  const { data: states } = useStateMaster();
  const { data: cities, data: items, isLoading } = usePincodeMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => (items || []).find((r) => String((r as any).PincodeId || (r as any).Id) === id) || null, [items, id]);

  const handleSubmit = async (form: PincodeFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await updateMaster("pincode", id, form as any);
      toast.success("Pin code updated.");
      router.push("/Location/Pincode");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update record.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" /></div>;
  if (!editing) return (<div className="p-8 text-center"><h2 className="text-xl font-bold">Record not found</h2><button onClick={() => router.push("/Location/Pincode")} className="mt-4 text-blue-500">Return</button></div>);

  return <div className="p-8"><PincodeForm data={editing} countries={countries || []} states={states || []} cities={cities || []} onSubmit={handleSubmit} onCancel={() => router.push("/Location/Pincode")} submitting={submitting} /></div>;
}
