"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  usePincodeMaster, 
  useCityMaster, 
  useStateMaster, 
  useCountryMaster 
} from "@/app/hooks/useMasters";
import { type PincodeFormData } from "@/app/lib/validations/masterSchemas";
import PincodeForm from "../../components/PincodeForm";
import { useMemo } from "react";
import type { PincodeRecord } from "@/app/types/master";

export default function EditPincodePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: countries } = useCountryMaster();
  const { data: states } = useStateMaster();
  const { data: cities } = useCityMaster();
  const { data: pincodes, isLoading, update } = usePincodeMaster();

  const editing = useMemo(() => {
    return (pincodes || []).find(r => String(r.PincodeId || r.Id) === id) || null;
  }, [pincodes, id]);

  const handleSubmit = async (form: PincodeFormData) => {
    try {
      if (!editing) return;
      await update.mutateAsync({ ...form, PincodeId: id } as any);
      toast.success("Pin Code updated.");
      router.push("/Location/Pincode");
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
          onClick={() => router.push("/Location/Pincode")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PincodeForm
        data={editing}
        countries={countries || []}
        states={states || []}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/Pincode")}
        submitting={update.isPending}
      />
    </div>
  );
}
