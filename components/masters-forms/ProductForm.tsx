"use client";

import { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { clsx } from "clsx";
import { z } from "zod";
import { ProductSchema, type ProductFormData } from "@/lib/validations/masterSchemas";
import type { ProductRecord } from "@/types/master";

type ProductFormProps = {
  data: ProductRecord | null;
  onSubmit: (form: ProductFormData) => void | Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

type ProductExtraInfo = {
  unitPrice?: string | number;
  unit?: string;
  stockQty?: string | number;
  isTaxable?: boolean;
  tax?: string;
  description?: string;
};

const unitOptions = ["Box", "Pieces", "Kilogram", "Dozen", "Liters", "Pack", "Unit"];
const taxOptions = [
  { label: "None", value: "None" },
  { label: "GST 5%", value: "GST5" },
  { label: "GST 12%", value: "GST12" },
  { label: "GST 18%", value: "GST18" },
  { label: "GST 28%", value: "GST28" },
];

function parseOtherInfo(raw?: string): ProductExtraInfo {
  if (!raw) return {};

  try {
    return JSON.parse(raw) as ProductExtraInfo;
  } catch (error) {
    console.error("Failed to parse OtherInfoJson", error);
    return {};
  }
}

function getDefaultValues(data: ProductRecord | null): ProductFormData {
  const extra = parseOtherInfo(data?.OtherInfoJson);

  return {
    Name: data?.Name ?? "",
    Code: data?.Code ?? "",
    Active: data ? data.Active === "1" || data.Active === true : true,
    UnitPrice: extra.unitPrice?.toString() ?? "",
    Unit: extra.unit ?? "Box",
    StockQty: extra.stockQty?.toString() ?? "",
    IsTaxable: extra.isTaxable ?? true,
    Tax: extra.tax ?? "None",
    Description: extra.description ?? "",
    OtherInfoJson: data?.OtherInfoJson ?? "",
  };
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800 sm:px-6">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white">{title}</h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function FieldRow({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-start gap-2 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
      <label className="pt-2 text-sm font-medium text-gray-600 dark:text-slate-400">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <div>
        {children}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}

function InputClass(hasError?: boolean) {
  return clsx(
    "h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition-all dark:bg-slate-950 dark:text-white",
    "placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-500",
    hasError ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-slate-800"
  );
}

export default function ProductForm({
  data,
  onSubmit,
  onCancel,
  submitting,
}: ProductFormProps) {
  type ProductFormValues = z.input<typeof ProductSchema>;

  const defaultValues = useMemo(() => getDefaultValues(data), [data]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isTaxable = watch("IsTaxable");

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form
        onSubmit={handleSubmit((values) => onSubmit(values as ProductFormData))}
        className="w-full space-y-8 pb-20 p-6 sm:p-8"
      >
        <div className="flex items-center gap-5 px-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900"
            >
              <ArrowLeft size={22} className="text-gray-500 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-950 dark:text-white">
                {data ? "Edit Product" : "Create Product"}
              </h1>
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-500">
                Product master details with pricing and stock information
              </p>
            </div>
          </div>
        </div>

        <SectionCard title="Product Information">
          <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <FieldRow label="Product Name" required error={errors.Name?.message}>
              <input
                {...register("Name")}
                placeholder="Enter product name"
                className={InputClass(!!errors.Name)}
              />
            </FieldRow>

            <FieldRow label="Product Code" required error={errors.Code?.message}>
              <input
                {...register("Code")}
                placeholder="Enter product code"
                className={InputClass(!!errors.Code)}
              />
            </FieldRow>

            <FieldRow label="Product Active">
              <label className="inline-flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <input
                  {...register("Active")}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span>Active</span>
              </label>
            </FieldRow>
          </div>
        </SectionCard>

        <SectionCard title="Price Information">
          <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <FieldRow label="Unit Price" error={errors.UnitPrice?.message as string | undefined}>
              <input
                {...register("UnitPrice")}
                type="number"
                step="0.01"
                placeholder="Rs."
                className={InputClass(!!errors.UnitPrice)}
              />
            </FieldRow>

            <FieldRow label="Taxable">
              <label className="inline-flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <input
                  {...register("IsTaxable")}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span>Yes, this product is taxable</span>
              </label>
            </FieldRow>

            <FieldRow label="Tax" error={errors.Tax?.message}>
              <select
                {...register("Tax")}
                disabled={!isTaxable}
                className={clsx(
                  InputClass(!!errors.Tax),
                  !isTaxable && "bg-gray-100 text-gray-400 dark:bg-slate-900 dark:text-slate-500"
                )}
              >
                {taxOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldRow>
          </div>
        </SectionCard>

        <SectionCard title="Stock Information">
          <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
            <FieldRow label="Usage Unit" error={errors.Unit?.message}>
              <select {...register("Unit")} className={InputClass(!!errors.Unit)}>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Quantity in Stock" error={errors.StockQty?.message as string | undefined}>
              <input
                {...register("StockQty")}
                type="number"
                placeholder="0"
                className={InputClass(!!errors.StockQty)}
              />
            </FieldRow>
          </div>
        </SectionCard>

        <SectionCard title="Description Information">
          <FieldRow label="Description" error={errors.Description?.message}>
            <textarea
              {...register("Description")}
              rows={4}
              placeholder="Enter product description"
              className={clsx(
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all dark:bg-slate-950 dark:text-white",
                "placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-500",
                errors.Description ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-slate-800"
              )}
            />
          </FieldRow>
        </SectionCard>

        <div className="flex flex-col gap-4 rounded-3xl border border-gray-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/80">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Review the product details before saving.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-premium-gradient relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-12 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-95 disabled:opacity-50 sm:min-w-[180px]"
            >
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save size={18} />
              )}
              <span>{submitting ? "Saving..." : data ? "Update Product" : "Save Product"}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-14 rounded-2xl border border-gray-200 px-8 text-sm font-bold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:min-w-[140px]"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
