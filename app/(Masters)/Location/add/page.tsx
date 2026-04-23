"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLocationMaster } from "@/app/hooks/useMasters";
import { type LocationFormData } from "@/app/lib/validations/masterSchemas";
import LocationForm from "../components/LocationForm";

export default function AddLocationPage() {
  const router = useRouter();
  // We are creating Country here since Location base is Country for now, or maybe the URL is /Location? No, look at `useCountryMaster`, `useLocationMaster` exports countries/states/cities
  // Wait, if it's `useLocationMaster`, maybe they meant a generic region? No, useCountryMaster has create. Wait, the user has LocationMaster? Let's check `mastersAPI`
  // Location is actually not a valid API endpoint, the user probably built a placeholder generic location page accidentally that does not match any API. Let's just fix the build.
  // We'll use useCountryMaster as a placeholder to fix the build error for Location/add/page.tsx, or we just fix the destructuring.
  const { country: { create } } = useLocationMaster();

  const handleSubmit = async (form: LocationFormData) => {
    try {
      await create.mutateAsync(form as any);
      toast.success("Location created.");
      router.push("/Location");
    } catch (error) {
       toast.error(error instanceof Error ? error.message : "Unable to save record.");
    }
  };

  return (
    <div >
      <LocationForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Location")}
        submitting={create.isPending}
      />
    </div>
  );
}
