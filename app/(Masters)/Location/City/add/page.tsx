"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCityMaster } from "@/app/hooks/useMasters";
import { type CityFormData } from "@/app/lib/validations/masterSchemas";
import CityForm from "../components/CityForm";

export default function AddCityPage() {
  const router = useRouter();
  const { states, create, isLoading } = useCityMaster();

  const handleSubmit = async (form: CityFormData) => {
    try {
      await create.mutateAsync({ ...form, CityId: "0" } as any);
      toast.success("City created.");
      router.push("/Location/City");
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
      <CityForm
        data={null}
        states={states}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/City")}
        submitting={create.isPending}
      />
    </div>
  );
}
