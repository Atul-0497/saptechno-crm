"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/hooks/useMasters";
import { usePurchaseOrders } from "@/hooks/usePurchaseOrders";
import type { PurchaseOrderFormData } from "@/lib/validations/masterSchemas";
import type { PurchaseOrderRecord } from "@/types/purchaseOrder";
import PurchaseOrderForm from "@/components/masters-forms/PurchaseOrderForm";

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: vendors } = useVendorMaster();
  const { countries, states } = useLocationMaster();
  const { data, isLoading, updatePurchaseOrder } = usePurchaseOrders();

  const editing = useMemo(() => (data || []).find((purchaseOrder) => purchaseOrder.id === id) || null, [data, id]);

  const handleSubmit = async (form: PurchaseOrderFormData) => {
    if (!editing) return;

    const selectedVendor = (vendors || []).find(
      (vendor) => String(vendor.VendorId || vendor.Id || "") === form.VendorId
    );

    const payload: PurchaseOrderRecord = {
      ...editing,
      purchaseTitle: form.PurchaseTitle,
      purchaseNumber: form.PurchaseNumber,
      vendorId: form.VendorId,
      vendorName: selectedVendor?.VendorName || selectedVendor?.Name || "",
      purchaseDate: form.PurchaseDate,
      expectedDeliveryDate: form.ExpectedDeliveryDate,
      status: form.Status,
      referenceNumber: form.ReferenceNumber,
      paymentTerms: form.PaymentTerms,
      billingCountry: form.BillingCountry,
      billingFlat: form.BillingFlat,
      billingStreet: form.BillingStreet,
      billingCity: form.BillingCity,
      billingState: form.BillingState,
      billingPostalCode: form.BillingPostalCode,
      billingLatitude: form.BillingLatitude,
      billingLongitude: form.BillingLongitude,
      shippingCountry: form.ShippingCountry,
      shippingFlat: form.ShippingFlat,
      shippingStreet: form.ShippingStreet,
      shippingCity: form.ShippingCity,
      shippingState: form.ShippingState,
      shippingPostalCode: form.ShippingPostalCode,
      shippingLatitude: form.ShippingLatitude,
      shippingLongitude: form.ShippingLongitude,
      orderedItems: form.OrderedItems,
      subTotal: form.SubTotal,
      discount: form.Discount,
      tax: form.Tax,
      adjustment: form.Adjustment,
      grandTotal: form.GrandTotal,
      termsAndConditions: form.TermsAndConditions,
      description: form.Description,
      updatedAt: new Date().toISOString(),
    };

    await updatePurchaseOrder(payload);
    toast.success("Purchase order updated successfully.");
    router.push("/PurchaseorderMaster");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  if (!editing) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchase order not found</h2>
        <button onClick={() => router.push("/PurchaseorderMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to purchase orders
        </button>
      </div>
    );
  }

  return (
    <PurchaseOrderForm
      data={editing}
      vendors={vendors || []}
      countries={countries}
      states={states}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/PurchaseorderMaster")}
      submitting={false}
    />
  );
}
