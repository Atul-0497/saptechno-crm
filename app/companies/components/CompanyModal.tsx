"use client";

import { useState } from "react";
import { Building2, CalendarDays, Mail, MapPin, Phone, X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { Company, CompanyFormValues } from "@/app/types/company";

type CompanyModalProps = {
  open: boolean;
  data: Company | null;
  onClose: () => void;
  onSubmit: (form: CompanyFormValues) => void | Promise<void>;
  submitting?: boolean;
};

const getInitialForm = (data: Company | null): CompanyFormValues => ({
  ...(data ?? {}),
  PlanStart: data?.PlanStart?.split("T")[0] || "",
  PlanEnd: data?.PlanEnd?.split("T")[0] || "",
  Active: String(data?.Active || "1"),
});

export default function CompanyModal({
  open,
  data,
  onClose,
  onSubmit,
  submitting = false,
}: CompanyModalProps) {
  const [form, setForm] = useState<CompanyFormValues>(() => getInitialForm(data));

  const updateField =
    (field: keyof CompanyFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    await onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
              <Building2 size={14} />
              {data ? "Edit tenant" : "New tenant"}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-950">
              {data ? "Update company profile" : "Create company profile"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Keep billing, access, and contact details tidy for this workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Company name</span>
            <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <Building2 size={18} className="text-gray-400" />
              <input
                value={form.Name || ""}
                onChange={updateField("Name")}
                placeholder="Saptechno CRM"
                required
                className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Email</span>
            <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={form.Email || ""}
                onChange={updateField("Email")}
                placeholder="admin@company.com"
                className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Mobile</span>
            <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <Phone size={18} className="text-gray-400" />
              <input
                value={form.Mobile || ""}
                onChange={updateField("Mobile")}
                placeholder="+91 98765 43210"
                className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Plan start</span>
            <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <CalendarDays size={18} className="text-gray-400" />
              <input
                type="date"
                value={form.PlanStart || ""}
                onChange={updateField("PlanStart")}
                className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Plan end</span>
            <div className="mt-2 flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <CalendarDays size={18} className="text-gray-400" />
              <input
                type="date"
                value={form.PlanEnd || ""}
                onChange={updateField("PlanEnd")}
                className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Status</span>
            <select
              value={String(form.Active || "1")}
              onChange={updateField("Active")}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Address</span>
            <div className="mt-2 flex items-start rounded-lg border border-gray-200 bg-white px-3 py-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100">
              <MapPin size={18} className="mt-1 text-gray-400" />
              <textarea
                value={form.Address || ""}
                onChange={updateField("Address")}
                placeholder="Billing or office address"
                rows={3}
                className="min-w-0 flex-1 resize-none border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-10 rounded-lg bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save company"}
          </button>
        </div>
      </form>
    </div>
  );
}
