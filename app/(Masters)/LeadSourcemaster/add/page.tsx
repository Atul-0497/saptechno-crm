"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLeadSourceMaster } from "@/app/hooks/useMasters";
import { type LeadSourceFormData } from "@/app/lib/validations/masterSchemas";
import LeadSourceForm from "../components/LeadSourceForm";

export default function AddLeadSourcePage() {
  const router = useRouter();
  const { create } = useLeadSourceMaster();

  const handleSubmit = async (form: LeadSourceFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Lead source created.");
      router.push("/LeadSourcemaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <LeadSourceForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/LeadSourcemaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
