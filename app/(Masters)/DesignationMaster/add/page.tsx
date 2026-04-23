"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDesignationMaster } from "@/app/hooks/useMasters";
import { type DesignationFormData } from "@/app/lib/validations/masterSchemas";
import DesignationForm from "../components/DesignationForm";

export default function AddDesignationPage() {
  const router = useRouter();
  const { create } = useDesignationMaster();

  const handleSubmit = async (form: DesignationFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Designation created.");
      router.push("/DesignationMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <DesignationForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/DesignationMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
