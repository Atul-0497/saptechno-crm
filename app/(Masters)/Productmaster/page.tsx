"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { clsx } from "clsx";
import { useProductMaster } from "@/hooks/useMasters";
import { isMasterActive } from "@/lib/utils/masterStatus";
import type { ProductRecord } from "@/types/master";
import { updateMaster, deleteMaster } from "@/actions/masters";

import UniversalTable from "@/components/tables/UniversalTable";
import { masterIdKeys, masterTableColumns } from "@/components/masters-forms/masterTableConfig";
import DeleteConfirmModal from "@/components/modal/DeleteConfirmModal";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useProductMaster();
  const products: ProductRecord[] = data || [];

  const [deleteItem, setDeleteItem] = useState<any>(null);
  const deleteId = deleteItem ? String(deleteItem.Id || deleteItem.ProductId || deleteItem.VendorId || deleteItem.CompanyId || deleteItem.LocationId || deleteItem.Code || deleteItem.DealerId || deleteItem.LeadSourceId || deleteItem.IndustryId || deleteItem.DepartmentId || deleteItem.DesignationId || deleteItem.PincodeId || deleteItem.StateId || deleteItem.CountryId || "") : null;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = products.filter((p) => isMasterActive(p.Active)).length;
  const inactiveCount = products.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((item) => {
      const active = isMasterActive(item.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const searchable = [item.Name, item.Code]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [products, query, status]);

  const statCards = [
    {
      label: "Total products",
      value: products.length,
      icon: Package,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Items in catalog",
    },
    {
      label: "Active now",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Ready for orders",
    },
    {
      label: "Retired / Off",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Inactive inventory",
    },
    {
      label: "Visible list",
      value: filtered.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Matching your filters",
    },
  ];

  const handleToggle = async (item: ProductRecord) => {
    try {
      const id = String(item.ProductId ?? item.Id ?? "");
      await updateMaster("product", id, {
        ...item,
        Active: isMasterActive(item.Active) ? "0" : "1",
      } as any);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to toggle status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMaster("product", deleteId);
      toast.success("Record removed.");
      setDeleteItem(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete record.");
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
                Inventory Master
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Product Management
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Manage your product catalog, pricing, and availability for quoting and sales.
              </p>
            </div>

            <Link
              href="/Productmaster/add"
              className="bg-premium-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <Plus size={20} className="transition-transform group-hover:rotate-90" />
              <span>Add Product</span>
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
                <div className="absolute -bottom-1 -right-1 h-12 w-12 rounded-full bg-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Product Listings</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Showing {filtered.length} of {products.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or code..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300 dark:hover:border-slate-700 dark:focus:border-blue-500"
            >
              <option value="all">Full Catalog</option>
              <option value="active">Active Only</option>
              <option value="inactive">Retired Products</option>
            </select>
          </div>
        </div>

        <UniversalTable
          columns={masterTableColumns.product}
          idKey={masterIdKeys.product}
          data={filtered}
          loading={isLoading}
          onEdit={(item) => {
            router.push(`/Productmaster/edit/${item.ProductId || item.Id}`);
          }}
          onDelete={(id, row) => setDeleteItem(row)}
          onToggleActive={handleToggle}
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
