"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useCompanyMaster } from "@/app/hooks/useMasters";
import CompanyTable from "./components/CompanyTable";
import CompanyModal from "./components/CompanyModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { buildCompanyPayload } from "@/app/lib/utils/companyPayload";
import { isCompanyActive } from "@/app/lib/utils/masterStatus";
import type { CompanyRecord, CompanyFormValues } from "@/app/types/master";

export default function Page() {
  const { data, isLoading, create, update, remove } = useCompanyMaster();
  const companies: CompanyRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCompanies = companies.filter((company) => isCompanyActive(company.Active));
  const inactiveCompanies = companies.length - activeCompanies.length;
  const filteredCompanies = useMemo(() => {
    const search = query.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" && isCompanyActive(company.Active)) ||
        (status === "inactive" && !isCompanyActive(company.Active));

      const searchable = [
        company.Name,
        company.Email,
        company.Mobile,
        company.Address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [companies, query, status]);

  const statCards = [
    {
      label: "Total companies",
      value: companies.length,
      icon: Building2,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "All tenants in this workspace",
    },
    {
      label: "Active accounts",
      value: activeCompanies.length,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Ready for daily operations",
    },
    {
      label: "Needs review",
      value: inactiveCompanies,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Paused or pending follow-up",
    },
    {
      label: "Visible now",
      value: filteredCompanies.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Matching your filters",
    },
  ];

  const closeModal = () => {
    create.reset();
    update.reset();
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: CompanyFormValues) => {
    try {
      if (editing) {
        const original = companies.find(
          (c) => c.CompanyId === editing.CompanyId
        );

        const payload = buildCompanyPayload(
          { ...form, CompanyId: editing.CompanyId },
          original,
          "update"
        );

        await update.mutateAsync(payload);
        toast.success("Company updated.");
      } else {
        const payload = buildCompanyPayload(form, {}, "create");
        await create.mutateAsync(payload);
        toast.success("Company created.");
      }

      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save company.");
    }
  };

  const handleInlineUpdate = async (updated: CompanyFormValues) => {
    const original = companies.find(
      (c) => c.CompanyId === updated.CompanyId
    );

    const payload = buildCompanyPayload(updated, original, "update");

    try {
      await update.mutateAsync(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update company.");
    }
  };

  const handleToggle = async (c: CompanyRecord) => {
    await handleInlineUpdate({
      ...c,
      Active: isCompanyActive(c.Active) ? "0" : "1",
    });
  };

  const handleDelete = async () => {
    const original = companies.find((c) => c.CompanyId === deleteId);

    if (!original) return;

    const payload = buildCompanyPayload(
      original,
      original,
      "delete"
    );

    try {
      await remove.mutateAsync(payload);
      toast.success("Company deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete company.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                <Sparkles size={14} />
                SaaS control center
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                Company management
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage tenant profiles, subscription windows, contacts, and active access from one clean workspace.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            >
              <Plus size={18} />
              Add company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="rounded-lg border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-950">{card.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${card.tone}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">{card.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950">Companies</h2>
            <p className="text-sm text-gray-500">
              {filteredCompanies.length} of {companies.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, mobile..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | "active" | "inactive")}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>

      <CompanyTable
        data={filteredCompanies}
        loading={isLoading}
        onEdit={(c) => {
          setEditing(c);
          setOpen(true);
        }}
        onDelete={(id) => setDeleteId(id)}
        onInlineUpdate={handleInlineUpdate}
        onToggleActive={handleToggle}
      />
      </section>

      <CompanyModal
        key={`${open ? "open" : "closed"}-${editing?.CompanyId ?? "new"}`}
        open={open}
        data={editing}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={create.isPending || update.isPending}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={remove.isPending}
      />
    </div>
  );
}
