"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  useEmployeeMaster, 
  useDepartmentMaster, 
  useDesignationMaster 
} from "@/app/hooks/useMasters";
import { type EmployeeFormData } from "@/app/lib/validations/masterSchemas";
import EmployeeForm from "../components/EmployeeForm";

export default function AddEmployeePage() {
  const router = useRouter();
  const { create, data: employees } = useEmployeeMaster();
  const { data: departments } = useDepartmentMaster();
  const { data: designations } = useDesignationMaster();

  const handleSubmit = async (form: EmployeeFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Employee onboarding successful.");
      router.push("/EmployeesMaster");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <EmployeeForm
        data={null}
        departments={departments || []}
        designations={designations || []}
        employees={employees || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/EmployeesMaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
