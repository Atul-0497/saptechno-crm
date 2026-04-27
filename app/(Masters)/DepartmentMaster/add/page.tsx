"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { masterKeys } from "@/app/hooks/useMasters";
import { useGenericSubmit } from "@/app/hooks/useGenericSubmit";
import { type DepartmentFormData } from "@/app/lib/validations/masterSchemas";
import DepartmentForm from "../components/DepartmentForm";

export default function AddDepartmentPage() {
  const router = useRouter();
  const { create } = useGenericSubmit("department", [masterKeys.departments()]);

  const handleSubmit = async (form: DepartmentFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Department created.");
      router.push("/DepartmentMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <DepartmentForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/DepartmentMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
