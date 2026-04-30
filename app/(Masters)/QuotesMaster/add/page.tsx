"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/hooks/useMasters";
import { useQuotes } from "@/hooks/useQuotes";
import type { QuoteFormData } from "@/lib/validations/masterSchemas";
import type { QuoteRecord } from "@/types/quote";
import QuoteForm from "@/components/masters/QuoteForm";

export default function AddQuotePage() {
  const router = useRouter();
  const { createQuote } = useQuotes();
  const { data: vendors } = useVendorMaster();
  const { countries, states } = useLocationMaster();

  const handleSubmit = async (form: QuoteFormData) => {
    const now = new Date().toISOString();
    const selectedVendor = (vendors || []).find(
      (vendor) => String(vendor.VendorId || vendor.Id || "") === form.VendorId
    );

    const payload: QuoteRecord = {
      id: crypto.randomUUID(),
      quoteTitle: form.QuoteTitle,
      quoteNumber: form.QuoteNumber,
      vendorId: form.VendorId,
      vendorName: selectedVendor?.VendorName || selectedVendor?.Name || "",
      quoteDate: form.QuoteDate,
      validUntil: form.ValidUntil,
      status: form.Status,
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
      quotedItems: form.QuotedItems,
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

    await createQuote(payload);
    toast.success("Quote created successfully.");
    router.push("/QuotesMaster");
  };

  return (
    <QuoteForm
      data={null}
      vendors={vendors || []}
      countries={countries}
      states={states}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/QuotesMaster")}
      submitting={false}
    />
  );
}
