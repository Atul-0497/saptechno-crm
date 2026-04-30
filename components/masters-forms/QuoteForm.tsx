"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, CalendarDays, Building2, BadgeCheck } from "lucide-react";
import UniversalForm, {
  FormSectionConfig,
  UniversalAddressSection,
  UniversalQuotedItemsSection,
  TermsAndConditionsCheckbox,
} from "@/components/forms/UniversalForm";
import { QuoteSchema, type QuoteFormData } from "@/lib/validations/masterSchemas";
import type { QuoteRecord } from "@/types/quote";
import type { CountryRecord, StateRecord, VendorRecord } from "@/types/master";

type QuoteFormProps = {
  data: QuoteRecord | null;
  vendors: VendorRecord[];
  countries: CountryRecord[];
  states: StateRecord[];
  onSubmit: (form: QuoteFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
};

const quoteStatuses = [
  { label: "Draft", value: "Draft" },
  { label: "Sent", value: "Sent" },
  { label: "Negotiation", value: "Negotiation" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
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

function getDefaultValues(data: QuoteRecord | null): QuoteFormData {
  const today = new Date().toISOString().slice(0, 10);

  return {
    QuoteTitle: data?.quoteTitle ?? "",
    QuoteNumber: data?.quoteNumber ?? `QT-${Date.now().toString().slice(-6)}`,
    VendorId: data?.vendorId ?? "",
    QuoteDate: data?.quoteDate ?? today,
    ValidUntil: data?.validUntil ?? today,
    Status: data?.status ?? "Draft",
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
    QuotedItems: data?.quotedItems?.length ? data.quotedItems : [defaultItem],
    SubTotal: String(data?.subTotal ?? 0),
    Discount: String(data?.discount ?? 0),
    Tax: String(data?.tax ?? 0),
    Adjustment: String(data?.adjustment ?? 0),
    GrandTotal: String(data?.grandTotal ?? 0),
    TermsAndConditions: data?.termsAndConditions ?? "",
    Description: data?.description ?? "",
  };
}

export default function QuoteForm({
  data,
  vendors,
  countries,
  states,
  onSubmit,
  onCancel,
  submitting,
}: QuoteFormProps) {
  const defaultValues = useMemo(() => getDefaultValues(data), [data]);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(QuoteSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const quotedItems = useWatch({ control: form.control, name: "QuotedItems" });
  const adjustment = useWatch({ control: form.control, name: "Adjustment" });

  useEffect(() => {
    const items = quotedItems || [];
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
        form.setValue(`QuotedItems.${index}.amount`, String(amount), {
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
  }, [quotedItems, adjustment, form]);

  const countryOptions = countries.map((country) => ({
    label: country.CountryName || country.Name || "",
    value: String(country.CountryId || country.Id || ""),
  }));

  const stateOptions = states.map((state) => ({
    label: state.StateName || state.Name || "",
    value: String(state.StateId || state.Id || ""),
  }));

  const billingFields: (keyof QuoteFormData)[] = [
    "BillingCountry",
    "BillingFlat",
    "BillingStreet",
    "BillingCity",
    "BillingState",
    "BillingPostalCode",
    "BillingLatitude",
    "BillingLongitude",
  ];

  const shippingFields: (keyof QuoteFormData)[] = [
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
      title: "Quote Overview",
      subtitle: "Commercial and customer-facing identifiers",
      fields: [
        {
          name: "QuoteTitle",
          label: "Quote Title",
          type: "text",
          icon: FileText,
          placeholder: "e.g. SAP Upgrade Proposal for Acme",
          required: true,
          colSpan: 2,
        },
        {
          name: "QuoteNumber",
          label: "Quote Number",
          type: "text",
          icon: BadgeCheck,
          placeholder: "QT-000123",
          required: true,
        },
        {
          name: "VendorId",
          label: "Vendor / Customer",
          type: "select",
          icon: Building2,
          required: true,
          options: vendors.map((vendor) => ({
            label: vendor.VendorName || vendor.Name || "Unnamed Vendor",
            value: String(vendor.VendorId || vendor.Id || ""),
          })),
        },
        {
          name: "QuoteDate",
          label: "Quote Date",
          type: "date",
          icon: CalendarDays,
          required: true,
        },
        {
          name: "ValidUntil",
          label: "Valid Until",
          type: "date",
          icon: CalendarDays,
          required: true,
        },
        {
          name: "Status",
          label: "Quote Status",
          type: "select",
          icon: BadgeCheck,
          required: true,
          options: quoteStatuses,
        },
      ],
    },
    {
      title: "Address Information",
      subtitle: "Billing and shipping details for the quote",
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
      title: "Quoted Items",
      subtitle: "Line items and financial summary",
      contentClassName: "block space-y-6",
      render: (formApi) => (
        <UniversalQuotedItemsSection
          form={formApi}
          itemsName="QuotedItems"
          summaryFields={{
            subTotal: "SubTotal",
            discount: "Discount",
            tax: "Tax",
            adjustment: "Adjustment",
            grandTotal: "GrandTotal",
          }}
          addRowLabel="Add row"
          emptyItem={defaultItem}
        />
      ),
    },
    {
      title: "Terms and Conditions",
      subtitle: "Commercial notes, payment schedule, and policy clauses",
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
                placeholder="Add payment terms, delivery schedule, validity, warranties..."
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
      subtitle: "Internal or customer-facing summary notes",
      fields: [
        {
          name: "Description",
          label: "Description",
          type: "textarea",
          placeholder: "Any extra context for this quote...",
          colSpan: 2,
        },
      ],
    },
  ];

  return (
    <UniversalForm
      title={data ? "Edit Quote" : "Create Quote"}
      subtitle={data ? `Updating ${data.quoteNumber}` : "Prepare a sales quote using reusable address and line-item sections"}
      sections={sections}
      schema={QuoteSchema}
      externalForm={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitting={submitting ?? false}
      submitLabel={data ? "Update Quote" : "Save Quote"}
    />
  );
}
