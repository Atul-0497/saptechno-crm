"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Factory, X } from "lucide-react";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type { IndustryRecord, IndustryFormValues } from "@/app/types/master";

type IndustryModalProps = {
  open: boolean;
  data: IndustryRecord | null;
  onClose: () => void;
  onSubmit: (form: IndustryFormValues) => void | Promise<void>;
  submitting: boolean;
};

export default function IndustryModal({
  open,
  data,
  onClose,
  onSubmit,
  submitting,
}: IndustryModalProps) {
  const [form, setForm] = useState<IndustryFormValues>({
    Name: "",
    Active: "1",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        Active: normalizeActiveFlag(data.Active ?? "1"),
      });
    } else {
      setForm({ Name: "", Active: "1" });
    }
  }, [data]);

  const updateField =
    (field: keyof IndustryFormValues) =>
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
        className="w-full max-w-md rounded-lg bg-white shadow-2xl text-left"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
              <Factory size={14} />
              {data ? "Edit sector" : "New sector"}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-950 text-left">
              {data ? "Update industry sector" : "Create industry sector"}
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

        <div className="space-y-4 px-5 py-5 text-left">
          <label className="block text-left">
            <span className="text-sm font-medium text-gray-700">Industry Name</span>
            <input
              value={form.Name || ""}
              onChange={updateField("Name")}
              placeholder="e.g. Technology, Healthcare, Finance"
              required
              className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-medium"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-3 py-3">
            <span>
              <span className="block text-sm font-medium text-gray-700">Active Status</span>
              <span className="text-xs text-gray-500">Available across leads & accounts</span>
            </span>
            <select
              value={normalizeActiveFlag(form.Active ?? "1")}
              onChange={updateField("Active")}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 cursor-pointer"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
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
            {submitting ? "Saving..." : "Save industry"}
          </button>
        </div>
      </form>
    </div>
  );
}
