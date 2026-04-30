"use client";

import React from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  LucideIcon,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MapPin,
  Package,
  CheckSquare,
} from "lucide-react";
import { clsx } from "clsx";
import {
  LuxurySection,
  LuxuryFieldWrapper,
  LuxuryInput,
  LuxurySelect,
  LuxuryTextarea,
} from "../ui/LuxuryFormComponents";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "date" | "email" | "password" | "checkbox";
  icon?: LucideIcon;
  placeholder?: string;
  required?: boolean;
  colSpan?: 1 | 2;
  options?: { label: string; value: string | number }[];
  hint?: string;
  defaultValue?: any;
}

export interface FormSectionConfig {
  title: string;
  subtitle?: string;
  fields?: FormFieldConfig[];
  contentClassName?: string;
  render?: (form: UseFormReturn<any>) => React.ReactNode;
}

type Option = { label: string; value: string | number };

type AddressFieldNames = {
  country: string;
  flat: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: string;
  longitude: string;
};

type AddressCardProps = {
  form: UseFormReturn<any>;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  fields: AddressFieldNames;
  countryOptions?: Option[];
  stateOptions?: Option[];
  clearLabel?: string;
  onClear?: () => void;
};

export type UniversalAddressSectionProps = {
  form: UseFormReturn<any>;
  billing: AddressFieldNames;
  shipping: AddressFieldNames;
  countryOptions?: Option[];
  stateOptions?: Option[];
  billingTitle?: string;
  shippingTitle?: string;
  onClearBilling?: () => void;
  onClearShipping?: () => void;
};

type QuoteSummaryFields = {
  subTotal: string;
  discount: string;
  tax: string;
  adjustment: string;
  grandTotal: string;
};

export type UniversalQuotedItemsSectionProps = {
  form: UseFormReturn<any>;
  itemsName: string;
  summaryFields: QuoteSummaryFields;
  addRowLabel?: string;
  emptyItem?: Record<string, unknown>;
};

export type TermsCheckboxProps = {
  form: UseFormReturn<any>;
  fieldName: string;
  label?: string;
};

interface UniversalFormProps<T extends z.ZodType<any, any>> {
  sections: FormSectionConfig[];
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  customHeader?: React.ReactNode;
  externalForm?: UseFormReturn<z.infer<T>>;
}

/* ══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════ */

const inputCls =
  "w-full rounded-lg border border-indigo-200/60 bg-white/90 px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500";

const selectCls =
  "w-full rounded-lg border border-indigo-200/60 bg-white/90 px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/70 mb-1.5 dark:text-slate-400">
      {children}
    </label>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADDRESS CARD (internal)
══════════════════════════════════════════════════════════════ */
function AddressCard({
  form,
  title,
  icon,
  colorClass,
  fields,
  countryOptions = [],
  stateOptions = [],
  clearLabel = "Clear All",
  onClear,
}: AddressCardProps) {
  const { register } = form;

  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-indigo-100/70 bg-white/90 overflow-hidden shadow-md shadow-indigo-100/20 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
      {/* Header */}
      <div className={clsx("flex items-center justify-between px-5 py-3.5 border-b border-indigo-100/60 dark:border-slate-800", colorClass)}>
        <div className="flex items-center gap-2.5">
          {icon}
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">{title}</h4>
        </div>
        {onClear && (
          <button type="button" onClick={onClear}
            className="text-xs font-bold text-indigo-400 hover:text-rose-500 transition-colors dark:text-slate-500 dark:hover:text-rose-400">
            {clearLabel}
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="p-5 space-y-4">
        <div>
          <FieldLabel>Country / Region</FieldLabel>
          <select {...register(fields.country)} className={selectCls}>
            <option value="">— Select Country —</option>
            {countryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Flat / Building</FieldLabel>
            <input {...register(fields.flat)} placeholder="Flat, House No." className={inputCls} />
          </div>
          <div>
            <FieldLabel>Street Address</FieldLabel>
            <input {...register(fields.street)} placeholder="Street name" className={inputCls} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>City</FieldLabel>
            <input {...register(fields.city)} placeholder="City" className={inputCls} />
          </div>
          <div>
            <FieldLabel>State / Province</FieldLabel>
            <select {...register(fields.state)} className={selectCls}>
              <option value="">— Select State —</option>
              {stateOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Zip / Postal Code</FieldLabel>
          <input {...register(fields.postalCode)} placeholder="Postal / ZIP code" className={inputCls} />
        </div>

        <div className="grid gap-3 grid-cols-2">
          <div>
            <FieldLabel>Latitude</FieldLabel>
            <input {...register(fields.latitude)} placeholder="e.g. 19.0760" className={inputCls} />
          </div>
          <div>
            <FieldLabel>Longitude</FieldLabel>
            <input {...register(fields.longitude)} placeholder="e.g. 72.8777" className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPORT: UniversalAddressSection
══════════════════════════════════════════════════════════════ */
export function UniversalAddressSection({
  form,
  billing,
  shipping,
  countryOptions,
  stateOptions,
  billingTitle = "Billing Address",
  shippingTitle = "Shipping Address",
  onClearBilling,
  onClearShipping,
}: UniversalAddressSectionProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <AddressCard
        form={form} title={billingTitle}
        icon={<MapPin size={15} className="text-indigo-500" />}
        colorClass="bg-indigo-50/60 dark:bg-indigo-950/20"
        fields={billing} countryOptions={countryOptions}
        stateOptions={stateOptions} onClear={onClearBilling}
      />
      <AddressCard
        form={form} title={shippingTitle}
        icon={<MapPin size={15} className="text-violet-500" />}
        colorClass="bg-violet-50/60 dark:bg-violet-950/20"
        fields={shipping} countryOptions={countryOptions}
        stateOptions={stateOptions} onClear={onClearShipping}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPORT: UniversalQuotedItemsSection
══════════════════════════════════════════════════════════════ */
export function UniversalQuotedItemsSection({
  form,
  itemsName,
  summaryFields,
  addRowLabel = "Add row",
  emptyItem = { productName: "", quantity: "", listPrice: "", amount: "", discount: "", tax: "", description: "" },
}: UniversalQuotedItemsSectionProps) {
  const { register, control } = form;
  const { fields, append, remove } = useFieldArray({ control, name: itemsName });

  return (
    <div className="space-y-4">
      {/* Item Cards */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id}
            className="rounded-2xl border border-indigo-100/70 bg-white/90 overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            {/* Row header */}
            <div className="flex items-center justify-between gap-3 border-b border-indigo-100/60 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Package size={13} className="text-indigo-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/80 dark:text-slate-400">
                  Item #{index + 1}
                </span>
              </div>
              <button type="button" onClick={() => remove(index)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 transition-all hover:bg-rose-100 hover:scale-110 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                <Trash2 size={13} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Product + Description */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FieldLabel>Product Name</FieldLabel>
                  <input {...register(`${itemsName}.${index}.productName`)} placeholder="Enter product name" className={inputCls} />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <input {...register(`${itemsName}.${index}.description`)} placeholder="Brief description" className={inputCls} />
                </div>
              </div>

              {/* Numeric fields — 2 cols on mobile, 5 on desktop */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <FieldLabel>Qty</FieldLabel>
                  <input {...register(`${itemsName}.${index}.quantity`)} type="number" placeholder="0" className={inputCls} />
                </div>
                <div>
                  <FieldLabel>Unit Price (₹)</FieldLabel>
                  <input {...register(`${itemsName}.${index}.listPrice`)} type="number" placeholder="0.00" className={inputCls} />
                </div>
                <div>
                  <FieldLabel>Amount (₹)</FieldLabel>
                  <input {...register(`${itemsName}.${index}.amount`)} readOnly placeholder="0.00"
                    className={clsx(inputCls, "bg-indigo-50/60 cursor-not-allowed dark:bg-slate-800")} />
                </div>
                <div>
                  <FieldLabel>Discount (₹)</FieldLabel>
                  <input {...register(`${itemsName}.${index}.discount`)} type="number" placeholder="0.00" className={inputCls} />
                </div>
                <div>
                  <FieldLabel>Tax (₹)</FieldLabel>
                  <input {...register(`${itemsName}.${index}.tax`)} type="number" placeholder="0.00" className={inputCls} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Row + Summary */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <button type="button" onClick={() => append(emptyItem)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 text-sm font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md active:scale-95 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300">
          <Plus size={16} />
          <span>{addRowLabel}</span>
        </button>

        {/* Financial Summary */}
        <div className="w-full lg:max-w-sm rounded-2xl border border-indigo-100/70 bg-white/90 shadow-md shadow-indigo-100/20 overflow-hidden dark:border-slate-800 dark:bg-slate-900/60">
          <div className="border-b border-indigo-100/60 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600/80 dark:text-slate-400">Financial Summary</p>
          </div>
          <div className="divide-y divide-indigo-50 dark:divide-slate-800">
            {[
              { label: "Sub Total (₹)", key: summaryFields.subTotal, readOnly: true, highlight: false },
              { label: "Discount (₹)", key: summaryFields.discount, readOnly: true, highlight: false },
              { label: "Tax (₹)", key: summaryFields.tax, readOnly: true, highlight: false },
              { label: "Adjustment (₹)", key: summaryFields.adjustment, readOnly: false, highlight: false },
              { label: "Grand Total (₹)", key: summaryFields.grandTotal, readOnly: true, highlight: true },
            ].map(({ label, key, readOnly, highlight }) => (
              <div key={key} className={clsx("flex items-center gap-3 px-5 py-3", highlight && "bg-indigo-50/80 dark:bg-indigo-950/30")}>
                <span className={clsx("flex-1 text-sm", highlight ? "font-extrabold text-indigo-700 dark:text-indigo-300" : "font-medium text-slate-600 dark:text-slate-400")}>
                  {label}
                </span>
                <input {...register(key)} readOnly={readOnly}
                  className={clsx(
                    "w-32 rounded-lg border px-3 py-2 text-right text-sm outline-none transition-all dark:bg-slate-900 dark:text-white",
                    highlight ? "border-indigo-300 bg-indigo-50 font-extrabold text-indigo-700 dark:border-indigo-700 dark:text-indigo-300"
                      : "border-indigo-200/60 bg-white/90 font-medium text-slate-800",
                    readOnly ? "cursor-not-allowed" : "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EXPORT: TermsAndConditionsCheckbox
══════════════════════════════════════════════════════════════ */
export function TermsAndConditionsCheckbox({
  form,
  fieldName,
  label = "I have read and agree to the terms and conditions stated above.",
}: TermsCheckboxProps) {
  const { register, watch } = form;
  const checked = watch(fieldName);

  return (
    <label className={clsx(
      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all select-none",
      checked
        ? "border-indigo-300 bg-indigo-50/80 dark:border-indigo-700 dark:bg-indigo-950/30"
        : "border-indigo-200/60 bg-white/80 hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900/40"
    )}>
      <div className="relative mt-0.5 shrink-0">
        <input type="checkbox" {...register(fieldName)} className="sr-only" />
        <div className={clsx(
          "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all",
          checked ? "border-indigo-500 bg-indigo-500" : "border-indigo-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        )}>
          {checked && <CheckSquare size={12} className="text-white" />}
        </div>
      </div>
      <span className={clsx(
        "text-sm leading-snug",
        checked ? "font-semibold text-indigo-700 dark:text-indigo-300" : "font-medium text-slate-600 dark:text-slate-400"
      )}>
        {label}
      </span>
    </label>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEFAULT EXPORT: UniversalForm (main form wrapper)
══════════════════════════════════════════════════════════════ */
export default function UniversalForm<T extends z.ZodType<any, any>>({
  sections,
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  title,
  subtitle,
  submitLabel = "Save Record",
  customHeader,
  externalForm,
}: UniversalFormProps<T>) {
  type FormData = z.infer<T>;

  const internalForm = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
  });

  const form = externalForm || internalForm;
  const { register, formState: { errors }, handleSubmit } = form;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-4 sm:p-6 lg:p-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onCancel}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-200 bg-white shadow-sm shadow-indigo-100/50 transition-all hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <ArrowLeft size={20} className="text-indigo-500 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter gradient-heading dark:text-white dark:[background:none] dark:[-webkit-text-fill-color:white] sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm font-semibold text-indigo-500/70 dark:text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {customHeader}
      </div>

      {/* ── Sections ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {sections.map((section, sIdx) => (
          <LuxurySection
            key={sIdx}
            title={section.title}
            subtitle={section.subtitle}
            contentClassName={section.contentClassName}
          >
            {section.render ? section.render(form) : section.fields?.map((field) => {
              const fieldError = (errors as any)[field.name]?.message;

              return (
                <div key={field.name} className={field.colSpan === 2 ? "sm:col-span-2" : "sm:col-span-1"}>
                  <LuxuryFieldWrapper label={field.label} error={fieldError} hint={field.hint} required={field.required}>
                    {field.type === "textarea" ? (
                      <LuxuryTextarea {...register(field.name as any)} icon={field.icon} placeholder={field.placeholder} error={fieldError} rows={4} />
                    ) : field.type === "select" ? (
                      <LuxurySelect {...register(field.name as any)} icon={field.icon} options={field.options || []} error={fieldError} placeholder={field.placeholder} />
                    ) : (
                      <LuxuryInput {...register(field.name as any)} type={field.type} icon={field.icon} placeholder={field.placeholder} error={fieldError} />
                    )}
                  </LuxuryFieldWrapper>
                </div>
              );
            })}
          </LuxurySection>
        ))}

        {/* ── Form Footer ── */}
        <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100/70 bg-white/80 p-5 shadow-md shadow-indigo-100/30 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/60 dark:text-slate-500">
            Carefully review all entries before committing.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={submitting}
              className="bg-premium-gradient relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-sm font-black text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-50 sm:min-w-[160px]">
              {submitting
                ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <Save size={17} />
              }
              <span>{submitLabel}</span>
            </button>
            <button type="button" onClick={onCancel}
              className="h-12 rounded-xl border border-indigo-200 px-7 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:min-w-[120px]">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
