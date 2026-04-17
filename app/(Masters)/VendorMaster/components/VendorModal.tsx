"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Truck, X } from "lucide-react";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type { VendorRecord, VendorFormValues, CityRecord } from "@/app/types/master";

type VendorModalProps = {
  open: boolean;
  data: VendorRecord | null;
  cities: CityRecord[];
  onClose: () => void;
  onSubmit: (form: VendorFormValues) => void | Promise<void>;
  submitting: boolean;
};

export default function VendorModal({
  open,
  data,
  cities,
  onClose,
  onSubmit,
  submitting,
}: VendorModalProps) {
  const [form, setForm] = useState<VendorFormValues>({
    VendorName: "",
    Email: "",
    Mobile: "",
    Address: "",
    CityId: "",
    Active: "1",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        Active: normalizeActiveFlag(data.Active ?? "1"),
      });
    } else {
      setForm({
        VendorName: "",
        Email: "",
        Mobile: "",
        Address: "",
        CityId: "",
        Active: "1",
      });
    }
  }, [data]);

  const updateField =
    (field: keyof VendorFormValues) =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Truck size={14} />
              {data ? "Edit Vendor" : "New Vendor"}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-950 dark:text-white">
              {data ? "Update Vendor Profile" : "Create New Vendor"}
            </h2>
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
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Vendor Name</span>
            <input
              value={form.VendorName || ""}
              onChange={updateField("VendorName")}
              placeholder="Full business name"
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Email Address</span>
            <input
              type="email"
              value={form.Email || ""}
              onChange={updateField("Email")}
              placeholder="vendor@example.com"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Mobile No</span>
            <input
              value={form.Mobile || ""}
              onChange={updateField("Mobile")}
              placeholder="Phone number"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label className="sm:col-span-1">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">City</span>
            <select
              value={form.CityId || ""}
              onChange={updateField("CityId")}
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={String(city.CityId ?? city.Id)} value={String(city.CityId ?? city.Id)}>
                  {city.CityName || city.Name}
                </option>
              ))}
            </select>
          </label>

          <label className="sm:col-span-1">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Status</span>
            <select
              value={normalizeActiveFlag(form.Active ?? "1")}
              onChange={updateField("Active")}
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Full Address</span>
            <textarea
              value={form.Address || ""}
              onChange={updateField("Address")}
              rows={3}
              placeholder="Physical street address..."
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
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
            {submitting ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
}
