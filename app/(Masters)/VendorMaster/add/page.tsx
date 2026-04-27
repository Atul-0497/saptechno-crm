"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { masterKeys, useLocationMaster } from "@/app/hooks/useMasters";
import { useGenericSubmit } from "@/app/hooks/useGenericSubmit";
import { type VendorFormData } from "@/app/lib/validations/masterSchemas";
import VendorForm from "../components/VendorForm";

export default function AddVendorPage() {
  const router = useRouter();
  const { create } = useGenericSubmit("vendor", [masterKeys.vendors()]);
  const { cities } = useLocationMaster();

  const handleSubmit = async (form: VendorFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Vendor profile created.");
      router.push("/VendorMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <VendorForm
        data={null}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/VendorMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
