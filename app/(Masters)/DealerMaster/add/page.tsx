"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDealerMaster, useLocationMaster } from "@/app/hooks/useMasters";
import { type DealerFormData } from "@/app/lib/validations/masterSchemas";
import DealerForm from "../components/DealerForm";

export default function AddDealerPage() {
  const router = useRouter();
  const { create } = useDealerMaster();
  const { cities } = useLocationMaster();

  const handleSubmit = async (form: DealerFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Dealer created.");
      router.push("/DealerMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <DealerForm
        data={null}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/DealerMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
