"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { useQuotes } from "@/hooks/useQuotes";
import type { QuoteRecord } from "@/types/quote";
import UniversalTable from "@/components/tables/UniversalTable";
import { masterTableColumns } from "@/components/masters/masterTableConfig";
import DeleteConfirmModal from "@/components/masters/DeleteConfirmModal";

export default function QuotesPage() {
  const router = useRouter();
  const { data, isLoading, deleteQuote } = useQuotes();
  const quotes: QuoteRecord[] = data;

  const [deleteItem, setDeleteItem] = useState<any>(null);
  const deleteId = deleteItem ? String(deleteItem.Id || deleteItem.ProductId || deleteItem.VendorId || deleteItem.CompanyId || deleteItem.LocationId || deleteItem.Code || deleteItem.DealerId || deleteItem.LeadSourceId || deleteItem.IndustryId || deleteItem.DepartmentId || deleteItem.DesignationId || deleteItem.PincodeId || deleteItem.StateId || deleteItem.CountryId || "") : null;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "sent" | "approved">("all");

  const approvedCount = quotes.filter((quote) => quote.status === "Approved").length;
  const draftCount = quotes.filter((quote) => quote.status === "Draft").length;

  const search = query.trim().toLowerCase();
  const filtered = quotes.filter((item) => {
    const matchesStatus =
      status === "all" ||
      (status === "draft" && item.status === "Draft") ||
      (status === "sent" && item.status === "Sent") ||
      (status === "approved" && item.status === "Approved");

    const searchable = [item.quoteTitle, item.quoteNumber, item.vendorName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && (!search || searchable.includes(search));
  });

  const statCards = [
    {
      label: "Total quotes",
      value: quotes.length,
      icon: FileText,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Commercial proposals created",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Accepted customer quotes",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: TrendingUp,
      tone: "bg-amber-50 text-amber-600",
      detail: "Still in preparation",
    },
    {
      label: "Filtered view",
      value: filtered.length,
      icon: WalletCards,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Current visible quotes",
    },
  ];

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteQuote(deleteId);
      toast.success("Quote deleted.");
      setDeleteItem(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete quote.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <div className="border-b border-gray-100 px-6 py-6 dark:border-slate-800 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
                <Sparkles size={14} className="animate-pulse" />
                Inventory Quotes
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Quote Management
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Build and manage reusable commercial quotations with billing, shipping, and line-item details.
              </p>
            </div>

            <Link
              href="/QuotesMaster/add"
              className="bg-premium-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <Plus size={20} className="transition-transform group-hover:rotate-90" />
              <span>Create Quote</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition-all hover:border-blue-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-blue-900 dark:hover:bg-slate-800/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-gray-950 dark:text-white">{card.value}</p>
                  </div>
                  <div className={clsx("rounded-xl p-3 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3", card.tone)}>
                    <Icon size={24} />
                  </div>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-500">{card.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Saved Quotes</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Showing {filtered.length} of {quotes.length} quote records
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search quote, number or vendor..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300"
            >
              <option value="all">All Quotes</option>
              <option value="draft">Draft Only</option>
              <option value="sent">Sent Only</option>
              <option value="approved">Approved Only</option>
            </select>
          </div>
        </div>

        <UniversalTable
          columns={masterTableColumns.quote}
          idKey="id"
          data={filtered}
          loading={isLoading}
          onEdit={(item) => router.push(`/QuotesMaster/edit/${item.id}`)}
          onDelete={(id, row) => setDeleteItem(row)}
        />
      </section>

      <DeleteConfirmModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        loading={isLoading}
        itemName={deleteItem?.Name || deleteItem?.CompanyName || deleteItem?.EmployeeName || deleteItem?.LocationName || deleteItem?.Pincode || deleteItem?.CityName || deleteItem?.StateName || deleteItem?.CountryName || deleteItem?.Code}
        entityName="Record"
      />
    </div>
  );
}
