"use client";

import { useParams } from "next/navigation";
import { useCompanyMaster } from "@/app/hooks/useMasters";
import { isCompanyActive } from "@/app/lib/utils/masterStatus";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { data } = useCompanyMaster();
  const companies = data;

  const company = companies.find(
    (c) => String(c.CompanyId) === String(id)
  );

  if (!company) {
    return <div className="p-6">Company not found</div>;
  }

  const isActive = isCompanyActive(company.Active);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h1 className="text-2xl font-bold">{company.Name}</h1>
        <p className="text-gray-500 text-sm">
          Company ID: {company.CompanyId}
        </p>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">
            {company.Email?.includes("@") ? company.Email : "N/A"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Mobile</p>
          <p className="font-medium">{company.Mobile || "-"}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{company.Address || "-"}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Plan Start</p>
          <p>{company.PlanStart || "-"}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Plan End</p>
          <p>{company.PlanEnd || "-"}</p>
        </div>

      </div>
    </div>
  );
}
