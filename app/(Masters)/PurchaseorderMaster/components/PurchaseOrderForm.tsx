"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Building2, CalendarDays, ClipboardList, FileText, Receipt } from "lucide-react";
import UniversalForm, { FormSectionConfig } from "@/app/components/forms/UniversalForm";
import { UniversalAddressSection, UniversalQuotedItemsSection, TermsAndConditionsCheckbox } from "@/app/components/forms/UniversalFormBlocks";
import { PurchaseOrderSchema, type PurchaseOrderFormData } from "@/app/lib/validations/masterSchemas";
import type { CountryRecord, StateRecord, VendorRecord } from "@/app/types/master";
import type { PurchaseOrderRecord } from "@/app/types/purchaseOrder";

type PurchaseOrderFormProps = {
  data: PurchaseOrderRecord | null;
  vendors: VendorRecord[];
  countries: CountryRecord[];
  states: StateRecord[];
  onSubmit: (form: PurchaseOrderFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

const purchaseStatuses = [
  { label: "Draft", value: "Draft" },
  { label: "Issued", value: "Issued" },
  { label: "Partially Received", value: "Partially Received" },
  { label: "Received", value: "Received" },
  { label: "Closed", value: "Closed" },
];

const defaultItem = {
  productName: "",
  quantity: "",
  listPrice: "",
  amount: "",
  discount: "",
  tax: "",
  description: "",
};

function parseNumber(value: string | number | undefined) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getDefaultValues(data: PurchaseOrderRecord | null): PurchaseOrderFormData {
  const today = new Date().toISOString().slice(0, 10);

  return {
    PurchaseTitle: data?.purchaseTitle ?? "",
    PurchaseNumber: data?.purchaseNumber ?? `PO-${Date.now().toString().slice(-6)}`,
    VendorId: data?.vendorId ?? "",
    PurchaseDate: data?.purchaseDate ?? today,
    ExpectedDeliveryDate: data?.expectedDeliveryDate ?? today,
    Status: data?.status ?? "Draft",
    ReferenceNumber: data?.referenceNumber ?? "",
    PaymentTerms: data?.paymentTerms ?? "",
    BillingCountry: data?.billingCountry ?? "",
    BillingFlat: data?.billingFlat ?? "",
    BillingStreet: data?.billingStreet ?? "",
    BillingCity: data?.billingCity ?? "",
    BillingState: data?.billingState ?? "",
    BillingPostalCode: data?.billingPostalCode ?? "",
    BillingLatitude: data?.billingLatitude ?? "",
    BillingLongitude: data?.billingLongitude ?? "",
    ShippingCountry: data?.shippingCountry ?? "",
    ShippingFlat: data?.shippingFlat ?? "",
    ShippingStreet: data?.shippingStreet ?? "",
    ShippingCity: data?.shippingCity ?? "",
    ShippingState: data?.shippingState ?? "",
    ShippingPostalCode: data?.shippingPostalCode ?? "",
    ShippingLatitude: data?.shippingLatitude ?? "",
    ShippingLongitude: data?.shippingLongitude ?? "",
    OrderedItems: data?.orderedItems?.length ? data.orderedItems : [defaultItem],
    SubTotal: String(data?.subTotal ?? 0),
    Discount: String(data?.discount ?? 0),
    Tax: String(data?.tax ?? 0),
    Adjustment: String(data?.adjustment ?? 0),
    GrandTotal: String(data?.grandTotal ?? 0),
    TermsAndConditions: data?.termsAndConditions ?? "",
    Description: data?.description ?? "",
  };
}

export default function PurchaseOrderForm({
  data,
  vendors,
  countries,
  states,
  onSubmit,
  onCancel,
  submitting,
}: PurchaseOrderFormProps) {
  const defaultValues = useMemo(() => getDefaultValues(data), [data]);

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const orderedItems = useWatch({ control: form.control, name: "OrderedItems" });
  const adjustment = useWatch({ control: form.control, name: "Adjustment" });

  useEffect(() => {
    const items = orderedItems || [];
    let subTotal = 0;
    let discount = 0;
    let tax = 0;

    items.forEach((item, index) => {
      const quantity = parseNumber(item?.quantity);
      const listPrice = parseNumber(item?.listPrice);
      const itemDiscount = parseNumber(item?.discount);
      const itemTax = parseNumber(item?.tax);
      const amount = quantity * listPrice;

      subTotal += amount;
      discount += itemDiscount;
      tax += itemTax;

      if (String(item?.amount ?? "") !== String(amount)) {
        form.setValue(`OrderedItems.${index}.amount`, String(amount), {
          shouldDirty: true,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    });

    const grandTotal = subTotal - discount + tax + parseNumber(adjustment);
    form.setValue("SubTotal", String(subTotal), { shouldDirty: true, shouldValidate: false });
    form.setValue("Discount", String(discount), { shouldDirty: true, shouldValidate: false });
    form.setValue("Tax", String(tax), { shouldDirty: true, shouldValidate: false });
    form.setValue("GrandTotal", String(grandTotal), { shouldDirty: true, shouldValidate: false });
  }, [adjustment, form, orderedItems]);

  const countryOptions = countries.map((country) => ({
    label: country.CountryName || country.Name || "",
    value: String(country.CountryId || country.Id || ""),
  }));

  const stateOptions = states.map((state) => ({
    label: state.StateName || state.Name || "",
    value: String(state.StateId || state.Id || ""),
  }));

  const billingFields: (keyof PurchaseOrderFormData)[] = [
    "BillingCountry",
    "BillingFlat",
    "BillingStreet",
    "BillingCity",
    "BillingState",
    "BillingPostalCode",
    "BillingLatitude",
    "BillingLongitude",
  ];

  const shippingFields: (keyof PurchaseOrderFormData)[] = [
    "ShippingCountry",
    "ShippingFlat",
    "ShippingStreet",
    "ShippingCity",
    "ShippingState",
    "ShippingPostalCode",
    "ShippingLatitude",
    "ShippingLongitude",
  ];

  const sections: FormSectionConfig[] = [
    {
      title: "Purchase Overview",
      subtitle: "Core purchase-order details used during vendor procurement",
      fields: [
        {
          name: "PurchaseTitle",
          label: "Purchase Title",
          type: "text",
          icon: ClipboardList,
          placeholder: "e.g. Office networking hardware procurement",
          required: true,
          colSpan: 2,
        },
        {
          name: "PurchaseNumber",
          label: "Purchase Number",
          type: "text",
          icon: Receipt,
          placeholder: "PO-000123",
          required: true,
        },
        {
          name: "VendorId",
          label: "Vendor",
          type: "select",
          icon: Building2,
          required: true,
          options: vendors.map((vendor) => ({
            label: vendor.VendorName || vendor.Name || "Unnamed Vendor",
            value: String(vendor.VendorId || vendor.Id || ""),
          })),
        },
        {
          name: "PurchaseDate",
          label: "Purchase Date",
          type: "date",
          icon: CalendarDays,
          required: true,
        },
        {
          name: "ExpectedDeliveryDate",
          label: "Expected Delivery Date",
          type: "date",
          icon: CalendarDays,
          required: true,
        },
        {
          name: "Status",
          label: "Purchase Status",
          type: "select",
          icon: BadgeCheck,
          required: true,
          options: purchaseStatuses,
        },
        {
          name: "ReferenceNumber",
          label: "Reference Number",
          type: "text",
          icon: FileText,
          placeholder: "Vendor quote / RFQ reference",
        },
        {
          name: "PaymentTerms",
          label: "Payment Terms",
          type: "text",
          icon: FileText,
          placeholder: "e.g. 50% advance, 50% on delivery",
        },
      ],
    },
    {
      title: "Address Information",
      subtitle: "Billing and shipping details for the purchase order",
      contentClassName: "block space-y-6",
      render: (formApi) => (
        <UniversalAddressSection
          form={formApi}
          countryOptions={countryOptions}
          stateOptions={stateOptions}
          billing={{
            country: "BillingCountry",
            flat: "BillingFlat",
            street: "BillingStreet",
            city: "BillingCity",
            state: "BillingState",
            postalCode: "BillingPostalCode",
            latitude: "BillingLatitude",
            longitude: "BillingLongitude",
          }}
          shipping={{
            country: "ShippingCountry",
            flat: "ShippingFlat",
            street: "ShippingStreet",
            city: "ShippingCity",
            state: "ShippingState",
            postalCode: "ShippingPostalCode",
            latitude: "ShippingLatitude",
            longitude: "ShippingLongitude",
          }}
          onClearBilling={() => {
            billingFields.forEach((field) => formApi.setValue(field, ""));
          }}
          onClearShipping={() => {
            shippingFields.forEach((field) => formApi.setValue(field, ""));
          }}
        />
      ),
    },
    {
      title: "Ordered Items",
      subtitle: "Products, quantities, pricing, taxes, and totals",
      contentClassName: "block space-y-6",
      render: (formApi) => (
        <UniversalQuotedItemsSection
          form={formApi}
          itemsName="OrderedItems"
          summaryFields={{
            subTotal: "SubTotal",
            discount: "Discount",
            tax: "Tax",
            adjustment: "Adjustment",
            grandTotal: "GrandTotal",
          }}
          addRowLabel="Add item"
          emptyItem={defaultItem}
        />
      ),
    },
    {
      title: "Terms and Conditions",
      subtitle: "Delivery notes, warranties, payment, and commercial clauses",
      contentClassName: "block space-y-5",
      render: (formApi) => {
        const { register } = formApi;
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/70 mb-2 dark:text-slate-400">
                Terms Text
              </label>
              <textarea
                {...register("TermsAndConditions")}
                rows={6}
                placeholder="Add delivery terms, warranty, inspection, payment conditions..."
                className="w-full rounded-xl border border-indigo-200/60 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 resize-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <TermsAndConditionsCheckbox
              form={formApi}
              fieldName="_termsAccepted"
              label="I have read and agree to the terms and conditions stated above."
            />
          </div>
        );
      },
    },
    {
      title: "Description Information",
      subtitle: "Internal notes or instructions for the procurement team",
      fields: [
        {
          name: "Description",
          label: "Description",
          type: "textarea",
          placeholder: "Any extra context for this purchase order...",
          colSpan: 2,
        },
      ],
    },
  ];

  return (
    <UniversalForm
      title={data ? "Edit Purchase Order" : "Create Purchase Order"}
      subtitle={
        data
          ? `Updating ${data.purchaseNumber}`
          : "Prepare a purchase order with vendor, address, and line-item details"
      }
      sections={sections}
      schema={PurchaseOrderSchema}
      externalForm={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting}
      submitLabel={data ? "Update Purchase Order" : "Save Purchase Order"}
    />
  );
}
