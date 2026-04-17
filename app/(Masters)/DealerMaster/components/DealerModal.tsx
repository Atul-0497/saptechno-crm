"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Users, X } from "lucide-react";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type { DealerRecord, DealerFormValues, CityRecord } from "@/app/types/master";

type DealerModalProps = {
  open: boolean;
  data: DealerRecord | null;
  cities: CityRecord[];
  onClose: () => void;
  onSubmit: (form: DealerFormValues) => void | Promise<void>;
  submitting: boolean;
};

export default function DealerModal({
  open,
  data,
  cities,
  onClose,
  onSubmit,
  submitting,
}: DealerModalProps) {
  const [form, setForm] = useState<DealerFormValues>({
    DealerName: "",
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
        DealerName: "",
        Email: "",
        Mobile: "",
        Address: "",
        CityId: "",
        Active: "1",
      });
    }
  }, [data]);

  const updateField =
    (field: keyof DealerFormValues) =>
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
              <Users size={14} />
              {data ? "Edit dealer" : "New dealer"}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-950">
              {data ? "Update dealer profile" : "Create new dealer"}
            </h2>
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
            <span className="text-sm font-medium text-gray-700">Dealer Name</span>
            <input
              value={form.DealerName || ""}
              onChange={updateField("DealerName")}
              placeholder="Business or individual name"
              required
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={form.Email || ""}
              onChange={updateField("Email")}
              placeholder="dealer@example.com"
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700">Mobile</span>
            <input
              value={form.Mobile || ""}
              onChange={updateField("Mobile")}
              placeholder="Primary contact number"
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </label>

          <label className="sm:col-span-1">
            <span className="text-sm font-medium text-gray-700">Operating City</span>
            <select
              value={form.CityId || ""}
              onChange={updateField("CityId")}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
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
            <span className="text-sm font-medium text-gray-700">Dealers Status</span>
            <select
              value={normalizeActiveFlag(form.Active ?? "1")}
              onChange={updateField("Active")}
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-gray-700">Full Address</span>
            <textarea
              value={form.Address || ""}
              onChange={updateField("Address")}
              rows={3}
              placeholder="Store or office address..."
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
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
            {submitting ? "Saving..." : "Save dealer"}
          </button>
        </div>
      </form>
    </div>
  );
}
