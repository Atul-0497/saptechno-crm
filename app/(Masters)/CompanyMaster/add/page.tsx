"use client";

import { createMaster } from "@/actions/masters";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CompanyForm from "@/components/masters-forms/CompanyForm";
import type { CompanyFormData } from "@/lib/validations/masterSchemas";

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (form: CompanyFormData) => {
    try {
      await createMaster("company", form as any);
      toast.success("Company profile created.");
      router.push("/CompanyMaster");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div>
      <CompanyForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/CompanyMaster")}
        submitting={false}
      />
    </div>
  );
}
