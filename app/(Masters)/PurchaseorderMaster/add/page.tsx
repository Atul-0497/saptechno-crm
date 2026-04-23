"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/app/hooks/useMasters";
import { usePurchaseOrders } from "@/app/hooks/usePurchaseOrders";
import type { PurchaseOrderFormData } from "@/app/lib/validations/masterSchemas";
import type { PurchaseOrderRecord } from "@/app/types/purchaseOrder";
import PurchaseOrderForm from "../components/PurchaseOrderForm";

export default function AddPurchaseOrderPage() {
  const router = useRouter();
  const { createPurchaseOrder } = usePurchaseOrders();
  const { data: vendors } = useVendorMaster();
  const { countries, states } = useLocationMaster();

  const handleSubmit = async (form: PurchaseOrderFormData) => {
    const now = new Date().toISOString();
    const selectedVendor = (vendors || []).find(
      (vendor) => String(vendor.VendorId || vendor.Id || "") === form.VendorId
    );

    const payload: PurchaseOrderRecord = {
      id: crypto.randomUUID(),
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
      createdAt: now,
      updatedAt: now,
    };

    await createPurchaseOrder(payload);
    toast.success("Purchase order created successfully.");
    router.push("/PurchaseorderMaster");
  };

  return (
    <PurchaseOrderForm
      data={null}
      vendors={vendors || []}
      countries={countries}
      states={states}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/PurchaseorderMaster")}
      submitting={false}
    />
  );
}
