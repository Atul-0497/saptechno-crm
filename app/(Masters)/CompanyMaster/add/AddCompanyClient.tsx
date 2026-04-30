"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CompanyForm from "../components/CompanyForm";
import type { CompanyFormData } from "@/app/lib/validations/masterSchemas";

type Props = {
  createAction: (entity: string, data: Record<string, any>) => Promise<any>;
};

export default function AddCompanyClient({ createAction }: Props) {
  const router = useRouter();

  const handleSubmit = async (form: CompanyFormData) => {
    try {
      await createAction("company", form as any);
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
