"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Map, X } from "lucide-react";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type { StateRecord, StateFormValues, CountryRecord } from "@/app/types/master";

type StateModalProps = {
  open: boolean;
  data: StateRecord | null;
  countries: CountryRecord[];
  onClose: () => void;
  onSubmit: (form: StateFormValues) => void | Promise<void>;
  submitting: boolean;
};

export default function StateModal({
  open,
  data,
  countries,
  onClose,
  onSubmit,
  submitting,
}: StateModalProps) {
  const [form, setForm] = useState<StateFormValues>({
    StateName: "",
    CountryId: "",
    Active: "1",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        Active: normalizeActiveFlag(data.Active ?? "1"),
      } as StateFormValues);
    } else {
      setForm({ StateName: "", CountryId: "", Active: "1" });
    }
  }, [data]);

  const updateField =
    (field: keyof StateFormValues) =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Map size={14} />
              {data ? "Edit State" : "New State"}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-950 dark:text-white">
              {data ? "Update State" : "Create State"}
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

        <div className="space-y-5 px-6 py-6 text-left">
          <label className="block">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">State Name</span>
            <input
              value={form.StateName || ""}
              onChange={updateField("StateName")}
              placeholder="e.g. California"
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Country</span>
            <select
              value={form.CountryId || ""}
              onChange={updateField("CountryId")}
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={String(c.CountryId ?? c.Id)} value={String(c.CountryId ?? c.Id)}>
                  {c.CountryName || c.Name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/30">
            <span>
              <span className="block text-sm font-bold text-gray-700 dark:text-slate-300">Active Status</span>
              <span className="text-xs text-gray-500 dark:text-slate-500">Available for address and shipping lookups</span>
            </span>
            <select
              value={normalizeActiveFlag(form.Active ?? "1")}
              onChange={updateField("Active")}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
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
            {submitting ? "Saving..." : "Save State"}
          </button>
        </div>
      </form>
    </div>

  );
}
