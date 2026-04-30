"use client";


import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDealerMaster, useLocationMaster } from "@/hooks/useMasters";
import DealerForm from "@/components/masters-forms/DealerForm";
import type { DealerFormData } from "@/lib/validations/masterSchemas";
import { entityCall } from "@/lib/api/genericClient";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: dealers, isLoading } = useDealerMaster();
  const { cities } = useLocationMaster();
  const [submitting, setSubmitting] = useState(false);

  const editing = useMemo(() => {
    return (dealers || []).find((r) => String(r.DealerId || r.Id) === id) || null;
  }, [dealers, id]);

  const handleSubmit = async (form: DealerFormData) => {
    try {
      if (!editing) return;
      setSubmitting(true);
      await entityCall("dealer", "update", { ...form, DealerId: id } as any);
      toast.success("Dealer updated.");
      router.push("/DealerMaster");
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
        <button onClick={() => router.push("/DealerMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DealerForm data={editing} cities={cities || []} onSubmit={handleSubmit} onCancel={() => router.push("/DealerMaster")} submitting={submitting} />
    </div>
  );
}
