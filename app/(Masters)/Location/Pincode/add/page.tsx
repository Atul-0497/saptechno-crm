"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  usePincodeMaster, 
  useCityMaster, 
  useStateMaster, 
  useCountryMaster 
} from "@/app/hooks/useMasters";
import { type PincodeFormData } from "@/app/lib/validations/masterSchemas";
import PincodeForm from "../components/PincodeForm";

export default function AddPincodePage() {
  const router = useRouter();
  const { data: countries } = useCountryMaster();
  const { data: states } = useStateMaster();
  const { data: cities } = useCityMaster();
  const { create } = usePincodeMaster();

  const handleSubmit = async (form: PincodeFormData) => {
    try {
      await create.mutateAsync({ ...form, PincodeId: "0" } as any);
      toast.success("Pin Code created.");
      router.push("/Location/Pincode");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <PincodeForm
        data={null}
        countries={countries || []}
        states={states || []}
        cities={cities || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location/Pincode")}
        submitting={create.isPending}
      />
    </div>
  );
}
