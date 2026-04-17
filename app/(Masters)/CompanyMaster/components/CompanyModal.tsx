"use client";

import { useState } from "react";
import { Building2, CalendarDays, Globe, Mail, MapPin, Phone, X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { CompanyRecord, CompanyFormValues } from "@/app/types/master";

type CompanyModalProps = {
  open: boolean;
  data: CompanyRecord | null;
  onClose: () => void;
  onSubmit: (form: CompanyFormValues) => void | Promise<void>;
  submitting?: boolean;
};

const getInitialForm = (data: CompanyRecord | null): CompanyFormValues => ({
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
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Building2 size={14} />
              {data ? "Edit Tenant" : "New Tenant"}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-950 dark:text-white">
              {data ? "Update Company Profile" : "Create Company Profile"}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Keep billing, access, and contact details tidy for this workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Company Name</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <Building2 size={18} className="text-gray-400" />
              <input
                value={form.Name || ""}
                onChange={updateField("Name")}
                placeholder="Saptechno CRM"
                required
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Email Address</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={form.Email || ""}
                onChange={updateField("Email")}
                placeholder="admin@company.com"
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Mobile Number</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <Phone size={18} className="text-gray-400" />
              <input
                value={form.Mobile || ""}
                onChange={updateField("Mobile")}
                placeholder="+91 98765 43210"
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Website URL</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <Globe size={18} className="text-gray-400" />
              <input
                value={form.Website || ""}
                onChange={updateField("Website")}
                placeholder="https://company.com"
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Plan Start Date</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <CalendarDays size={18} className="text-gray-400" />
              <input
                type="date"
                value={form.PlanStart || ""}
                onChange={updateField("PlanStart")}
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none dark:text-white dark:[color-scheme:dark]"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Plan End Date</span>
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <CalendarDays size={18} className="text-gray-400" />
              <input
                type="date"
                value={form.PlanEnd || ""}
                onChange={updateField("PlanEnd")}
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-gray-900 outline-none dark:text-white dark:[color-scheme:dark]"
              />
            </div>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Account Status</span>
            <select
              value={String(form.Active || "1")}
              onChange={updateField("Active")}
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Corporate Address</span>
            <div className="mt-2 flex items-start rounded-xl border border-gray-200 bg-white px-3 py-3 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500">
              <MapPin size={18} className="mt-1 text-gray-400" />
              <textarea
                value={form.Address || ""}
                onChange={updateField("Address")}
                placeholder="Billing or office address"
                rows={3}
                className="min-w-0 flex-1 resize-none border-0 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-gray-200 px-6 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-premium-gradient relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
