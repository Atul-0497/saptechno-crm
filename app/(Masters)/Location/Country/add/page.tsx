"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCountryMaster } from "@/app/hooks/useMasters";
import { type CountryFormData } from "@/app/lib/validations/masterSchemas";
import CountryForm from "../components/CountryForm";

export default function AddCountryPage() {
  const router = useRouter();
  const { create } = useCountryMaster();

  const handleSubmit = async (form: CountryFormData) => {
    try {
      // API expects CountryId "0" for new records in this master based on existing code
      await create.mutateAsync({ ...form, CountryId: "0" } as any);
      toast.success("Country created.");
      router.push("/Location/Country");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <CountryForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/Country")}
        submitting={create.isPending}
      />
    </div>
  );
}
