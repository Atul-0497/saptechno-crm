"use client";

import {
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  UserRound,
  Calendar,
} from "lucide-react";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { EmployeeRecord, SimpleMasterRecord } from "@/app/types/master";

type EmployeeTableProps = {
  data: EmployeeRecord[];
  departments: SimpleMasterRecord[];
  designations: SimpleMasterRecord[];
  loading: boolean;
  onEdit: (emp: EmployeeRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (emp: EmployeeRecord) => void | Promise<void>;
};

export default function EmployeeTable({
  data,
  departments,
  designations,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: EmployeeTableProps) {
  const byId = (items: SimpleMasterRecord[], id?: string) =>
    items.find((item) => String(item.Id) === String(id));

  const formatDate = (val?: string) => {
    if (!val) return "—";
    const date = new Date(val);
    return isNaN(date.getTime())
      ? val.split("T")[0]
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const getInitials = (first?: string, last?: string) =>
    `${(first || "E")[0]}${(last || "")[0] || ""}`.toUpperCase();

  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block text-left">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
          <thead className="bg-gray-50/80 text-left dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Employee
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Role & Dept
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Contact
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Joining
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-800 dark:bg-transparent">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((emp) => {
                const isActive = isMasterActive(emp.Active);
                const deptName = emp.DepartmentName || emp.Department || byId(departments, emp.DepartmentId)?.Name || "—";
                const desigName = emp.DesignationName || emp.Designation || byId(designations, emp.DesignationId)?.Name || "—";

                return (
                  <tr key={emp.Id} className="transition hover:bg-cyan-50/30 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white dark:bg-slate-800 dark:text-slate-200">
                          {getInitials(emp.FirstName, emp.LastName)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-950 truncate dark:text-white">
                            {emp.FirstName} {emp.LastName}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded inline-block dark:bg-slate-800 dark:text-slate-400">
                            {emp.EmployeeCode || "NO-CODE"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-slate-200">{desigName}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{deptName}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-sm text-gray-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400 dark:text-slate-500" />
                          <span>{emp.EmailId || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400 dark:text-slate-500" />
                          <span>{emp.MobileNo || "—"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                        <Calendar size={14} className="text-gray-400 dark:text-slate-500" />
                        {formatDate(emp.JoiningDate)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleActive(emp)}
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(emp)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-cyan-400"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(emp.Id ?? "")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-gray-100 lg:hidden text-left dark:divide-slate-800">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-28 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            </div>
          ))}

        {!loading &&
          data.map((emp) => {
            const isActive = isMasterActive(emp.Active);

            return (
              <article key={emp.Id} className="p-4">
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white dark:bg-slate-800 dark:text-slate-200">
                      {getInitials(emp.FirstName, emp.LastName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950 dark:text-white">
                        {emp.FirstName} {emp.LastName}
                      </h3>
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">{emp.EmployeeCode || "NO-CODE"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(emp)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                        : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400">Email</div>
                    <div className="mt-1 truncate text-gray-800 dark:text-slate-200">{emp.EmailId || "—"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400">Dept</div>
                    <div className="mt-1 truncate text-gray-800 dark:text-slate-200">
                       {emp.DepartmentName || emp.Department || byId(departments, emp.DepartmentId)?.Name || "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onEdit(emp)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-slate-700 dark:text-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(emp.Id ?? "")}
                    className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-900/20 dark:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
            <UserRound size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">No employees found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-slate-400">
            Onboard your first employee to start managing your workforce.
          </p>
        </div>
      )}
    </div>
  );
}
