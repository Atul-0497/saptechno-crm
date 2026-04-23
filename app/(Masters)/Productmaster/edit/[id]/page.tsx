"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProductMaster } from "@/app/hooks/useMasters";
import type { ProductRecord } from "@/app/types/master";
import { type ProductFormData } from "@/app/lib/validations/masterSchemas";
import ProductForm from "../../components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data, isLoading, update } = useProductMaster();
  const editing =
    (data as ProductRecord[] | undefined)?.find((product) => product.ProductId === id || product.Id === id) ||
    null;

  const handleSubmit = async (form: ProductFormData) => {
    try {
      if (!editing) return;

      const otherInfo = {
        unitPrice: form.UnitPrice,
        unit: form.Unit,
        stockQty: form.StockQty,
        isTaxable: form.IsTaxable,
        tax: form.Tax,
        description: form.Description,
      };

      const payload: ProductRecord = {
        ProductId: id,
        Name: form.Name,
        Code: form.Code,
        OtherInfoJson: JSON.stringify(otherInfo),
        Active: form.Active === true ? "1" : "0",
      };

      await update.mutateAsync(payload);
      toast.success("Product updated successfully.");
      router.push("/Productmaster");
    } catch (error) {
       console.error("Save error:", error);
       toast.error(error instanceof Error ? error.message : "Unable to save product.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  if (!editing && !isLoading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product not found</h2>
        <button 
          onClick={() => router.push("/Productmaster")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Return to catalog
        </button>
      </div>
    );
  }

  return (
    <ProductForm
      data={editing}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/Productmaster")}
      submitting={update.isPending}
    />
  );
}
