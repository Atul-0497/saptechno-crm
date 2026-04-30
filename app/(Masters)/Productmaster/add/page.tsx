"use client";

import { createMaster } from "@/actions/masters";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { ProductFormData } from "@/lib/validations/masterSchemas";
import ProductForm from "@/components/masters-forms/ProductForm";
import type { ProductRecord } from "@/types/master";

export default function Page() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form: ProductFormData) => {
    try {
      setSubmitting(true);
      const otherInfo = {
        unitPrice: form.UnitPrice,
        unit: form.Unit,
        stockQty: form.StockQty,
        isTaxable: form.IsTaxable,
        tax: form.Tax,
        description: form.Description,
      };

      const payload: ProductRecord = {
        Name: form.Name,
        Code: form.Code,
        OtherInfoJson: JSON.stringify(otherInfo),
        Active: form.Active === true ? "1" : "0",
      };

      await createMaster("product", payload as any);
      toast.success("Product created successfully.");
      router.push("/Productmaster");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ProductForm data={null} onSubmit={handleSubmit} onCancel={() => router.push("/Productmaster")} submitting={submitting} />
    </div>
  );
}
