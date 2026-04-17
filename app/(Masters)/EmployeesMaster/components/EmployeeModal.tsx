"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { UserRound, X } from "lucide-react";
import { normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type {
  EmployeeRecord,
  EmployeeFormValues,
  SimpleMasterRecord,
} from "@/app/types/master";

type EmployeeModalProps = {
  open: boolean;
  data: EmployeeRecord | null;
  departments: SimpleMasterRecord[];
  designations: SimpleMasterRecord[];
  employees: EmployeeRecord[];
  onClose: () => void;
  onSubmit: (form: EmployeeFormValues) => void | Promise<void>;
  submitting: boolean;
};

export default function EmployeeModal({
  open,
  data,
  departments,
  designations,
  employees,
  onClose,
  onSubmit,
  submitting,
}: EmployeeModalProps) {
  const [form, setForm] = useState<EmployeeFormValues>({
    FirstName: "",
    LastName: "",
    EmployeeCode: "",
    JoiningDate: "",
    EmailId: "",
    MobileNo: "",
    DepartmentId: "",
    DesignationId: "",
    ReportingTo: "0",
    Password: "",
    Active: "1",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        JoiningDate: data.JoiningDate?.split("T")[0] || "",
        Active: normalizeActiveFlag(data.Active ?? "1"),
        Password: "", // Don't pre-fill password for security
      } as EmployeeFormValues);
    } else {
      setForm({
        FirstName: "",
        LastName: "",
        EmployeeCode: "",
        JoiningDate: new Date().toISOString().split("T")[0],
        EmailId: "",
        MobileNo: "",
        DepartmentId: "",
        DesignationId: "",
        ReportingTo: "0",
        Password: "",
        Active: "1",
      });
    }
  }, [data]);

  const updateField =
    (field: keyof EmployeeFormValues) =>
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
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <UserRound size={14} />
              {data ? "Staff Profile" : "Onboarding"}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-gray-950 dark:text-white">
              {data ? "Update Employee Details" : "Register New Employee"}
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
          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">First Name</span>
            <input
              value={form.FirstName || ""}
              onChange={updateField("FirstName")}
              placeholder="e.g. John"
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Last Name</span>
            <input
              value={form.LastName || ""}
              onChange={updateField("LastName")}
              placeholder="e.g. Doe"
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Employee Code</span>
            <input
              value={form.EmployeeCode || ""}
              onChange={updateField("EmployeeCode")}
              placeholder="e.g. ST-001"
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Joining Date</span>
            <input
              type="date"
              value={form.JoiningDate || ""}
              onChange={updateField("JoiningDate")}
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:[color-scheme:dark]"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Email Address</span>
            <input
              type="email"
              value={form.EmailId || ""}
              onChange={updateField("EmailId")}
              placeholder="john@example.com"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Mobile Number</span>
            <input
              value={form.MobileNo || ""}
              onChange={updateField("MobileNo")}
              placeholder="Contact number"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Department</span>
            <select
              value={form.DepartmentId || ""}
              onChange={updateField("DepartmentId")}
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.Id} value={dept.Id}>
                  {dept.Name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Designation</span>
            <select
              value={form.DesignationId || ""}
              onChange={updateField("DesignationId")}
              required
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="">Select designation</option>
              {designations.map((desig) => (
                <option key={desig.Id} value={desig.Id}>
                  {desig.Name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Reporting To</span>
            <select
              value={form.ReportingTo || "0"}
              onChange={updateField("ReportingTo")}
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-800 outline-none transition-all hover:bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800/50 dark:focus:border-blue-500"
            >
              <option value="0">Self / None</option>
              {employees
                .filter((e) => String(e.Id) !== String(data?.Id))
                .map((emp) => (
                  <option key={emp.Id} value={emp.Id}>
                    {emp.FirstName} {emp.LastName} ({emp.EmployeeCode})
                  </option>
                ))}
            </select>
          </label>

          <label>
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
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
              {data ? "Change Password (Leave blank to keep current)" : "Password"}
            </span>
            <input
              type="password"
              value={form.Password || ""}
              onChange={updateField("Password")}
              placeholder="••••••••"
              required={!data}
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
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
            {submitting ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </form>
    </div>

  );
}