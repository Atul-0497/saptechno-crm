"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useIndustryMaster } from "@/app/hooks/useMasters";
import { type IndustryFormData } from "@/app/lib/validations/masterSchemas";
import IndustryForm from "../components/IndustryForm";

export default function AddIndustryPage() {
  const router = useRouter();
  const { create } = useIndustryMaster();

  const handleSubmit = async (form: IndustryFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Industry created.");
      router.push("/IndustryMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <IndustryForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/IndustryMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
