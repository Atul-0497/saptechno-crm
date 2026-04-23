"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateMaster } from "@/app/hooks/useMasters";
import { type StateFormData } from "@/app/lib/validations/masterSchemas";
import StateForm from "../components/StateForm";

export default function AddStatePage() {
  const router = useRouter();
  const { countries, create, isLoading } = useStateMaster();

  const handleSubmit = async (form: StateFormData) => {
    try {
      await create.mutateAsync({ ...form, StateId: "0" } as any);
      toast.success("State created.");
      router.push("/Location/State");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div >
      <StateForm
        data={null}
        countries={countries}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/State")}
        submitting={create.isPending}
      />
    </div>
  );
}
