"use client";

import {
  Building2,
  CalendarDays,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Power,
  Trash2,
} from "lucide-react";
import { isCompanyActive } from "@/app/lib/utils/companyStatus";
import type { Company } from "@/app/types/company";

type CompanyTableProps = {
  data: Company[];
  loading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
  onInlineUpdate: (company: Company) => void | Promise<void>;
  onToggleActive: (company: Company) => void | Promise<void>;
};

export default function CompanyTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: CompanyTableProps) {
  const formatDate = (value?: string) => {
    if (!value) return "Not set";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value.split("T")[0] || "Not set";

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getInitials = (name?: string) =>
    (name || "Company")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CO";

  return (
    <div className="overflow-hidden">
      <div className="hidden min-w-full lg:block">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Plan
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-4">
                      <div className="h-4 w-full max-w-36 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              data.map((company) => {
                const isActive = isCompanyActive(company.Active);

                return (
                  <tr key={company.CompanyId} className="transition hover:bg-cyan-50/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white">
                          {getInitials(company.Name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-950">{company.Name || "Untitled company"}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Building2 size={13} />
                            <span className="truncate">{company.Address || "No address added"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail size={15} className="text-gray-400" />
                          <span>{company.Email || "No email"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone size={15} className="text-gray-400" />
                          <span>{company.Mobile || "No mobile"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <CalendarDays size={16} className="mt-0.5 text-gray-400" />
                        <div>
                          <div>{formatDate(company.PlanStart)}</div>
                          <div className="text-xs text-gray-500">to {formatDate(company.PlanEnd)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onToggleActive(company)}
                        className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onToggleActive(company)}
                          title={isActive ? "Deactivate" : "Activate"}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => onEdit(company)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(company.CompanyId)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
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

      <div className="divide-y divide-gray-100 lg:hidden">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ))}

        {!loading &&
          data.map((company) => {
            const isActive = isCompanyActive(company.Active);

            return (
              <article key={company.CompanyId} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-sm font-semibold text-white">
                      {getInitials(company.Name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-950">{company.Name || "Untitled company"}</h3>
                      <p className="truncate text-sm text-gray-500">{company.Email || "No email"}</p>
                    </div>
                  </div>
                  <MoreHorizontal className="text-gray-300" size={20} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs font-medium text-gray-500">Mobile</div>
                    <div className="mt-1 truncate text-gray-800">{company.Mobile || "No mobile"}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-xs font-medium text-gray-500">Plan end</div>
                    <div className="mt-1 truncate text-gray-800">{formatDate(company.PlanEnd)}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onToggleActive(company)}
                    className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {isActive ? "Active" : "Inactive"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(company)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(company.CompanyId)}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Building2 size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-950">No companies found</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your first company or adjust the search and status filters.
          </p>
        </div>
      )}
    </div>
  );
}
