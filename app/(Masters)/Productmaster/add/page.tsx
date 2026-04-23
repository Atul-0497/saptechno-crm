"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProductMaster } from "@/app/hooks/useMasters";
import type { ProductRecord } from "@/app/types/master";
import { type ProductFormData } from "@/app/lib/validations/masterSchemas";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const { create } = useProductMaster();

  const handleSubmit = async (form: ProductFormData) => {
    try {
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

      await create.mutateAsync(payload);
      toast.success("Product created successfully.");
      router.push("/Productmaster");
    } catch (error) {
       console.error("Save error:", error);
       toast.error(error instanceof Error ? error.message : "Unable to save product.");
    }
  };

  return (
    <div>
      <ProductForm
        data={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/Productmaster")}
        submitting={create.isPending}
      />
    </div>
  );
}
