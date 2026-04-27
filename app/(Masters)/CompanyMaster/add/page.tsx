"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { masterKeys } from "@/app/hooks/useMasters";
import { useGenericSubmit } from "@/app/hooks/useGenericSubmit";
import { type CompanyFormData } from "@/app/lib/validations/masterSchemas";
import CompanyForm from "../components/CompanyForm";

export default function AddCompanyPage() {
  const router = useRouter();
  const { create } = useGenericSubmit("company", [masterKeys.companies()]);

  const handleSubmit = async (form: CompanyFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Company profile created.");
      router.push("/CompanyMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <CompanyForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/CompanyMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
