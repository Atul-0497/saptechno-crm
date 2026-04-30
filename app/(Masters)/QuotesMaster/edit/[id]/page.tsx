"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useVendorMaster, useLocationMaster } from "@/hooks/useMasters";
import { useQuotes } from "@/hooks/useQuotes";
import type { QuoteFormData } from "@/lib/validations/masterSchemas";
import type { QuoteRecord } from "@/types/quote";
import QuoteForm from "@/components/masters/QuoteForm";

export default function EditQuotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: vendors } = useVendorMaster();
  const { countries, states } = useLocationMaster();
  const { data, isLoading, updateQuote } = useQuotes();

  const editing = useMemo(() => (data || []).find((quote) => quote.id === id) || null, [data, id]);

  const handleSubmit = async (form: QuoteFormData) => {
    if (!editing) return;

    const selectedVendor = (vendors || []).find(
      (vendor) => String(vendor.VendorId || vendor.Id || "") === form.VendorId
    );

    const payload: QuoteRecord = {
      ...editing,
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
      updatedAt: new Date().toISOString(),
    };

    await updateQuote(payload);
    toast.success("Quote updated successfully.");
    router.push("/QuotesMaster");
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quote not found</h2>
        <button onClick={() => router.push("/QuotesMaster")} className="mt-4 text-blue-500 hover:underline">
          Return to quotes
        </button>
      </div>
    );
  }

  return (
    <QuoteForm
      data={editing}
      vendors={vendors || []}
      countries={countries}
      states={states}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/QuotesMaster")}
      submitting={false}
    />
  );
}
