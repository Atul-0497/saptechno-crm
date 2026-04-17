"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Truck,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useVendorMaster } from "@/app/hooks/useMasters";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { VendorRecord, VendorFormValues } from "@/app/types/master";

import VendorTable from "./components/VendorTable";
import VendorModal from "./components/VendorModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Page() {
  const { data, cities, isLoading, isLookupLoading, create, update, remove } = useVendorMaster();
  const vendors: VendorRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VendorRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = vendors.filter((v) => isMasterActive(v.Active)).length;
  const inactiveCount = vendors.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return vendors.filter((item) => {
      const active = isMasterActive(item.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const searchable = [
        item.VendorName,
        item.Email,
        item.Mobile,
        item.Address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [vendors, query, status]);

  const statCards = [
    {
      label: "Total vendors",
      value: vendors.length,
      icon: Truck,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Registered suppliers",
    },
    {
      label: "Active now",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Ready for procurement",
    },
    {
      label: "On hold",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Inactive profiles",
    },
    {
      label: "Matches",
      value: filtered.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Search result count",
    },
  ];

  const closeModal = () => {
    create.reset();
    update.reset();
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: VendorFormValues) => {
    try {
      if (editing) {
        await update.mutateAsync({ ...form, Id: editing.Id } as VendorRecord);
        toast.success("Vendor updated.");
      } else {
        await create.mutateAsync(form as VendorRecord);
        toast.success("Vendor created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save vendor.");
    }
  };

  const handleToggle = async (item: VendorRecord) => {
    try {
      await update.mutateAsync({
        ...item,
        Active: isMasterActive(item.Active) ? "0" : "1",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to toggle status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("Vendor deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete vendor.");
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
                Supply chain master
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                Vendor management
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage your supplier database, contact details, and locations to streamline procurement.
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
              Add vendor
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
            <h2 className="text-base font-semibold text-gray-950">Listings</h2>
            <p className="text-sm text-gray-500">
              {filtered.length} of {vendors.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, contact, city..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>

        <VendorTable
          data={filtered}
          cities={cities}
          loading={isLoading || isLookupLoading}
          onEdit={(vendor) => {
            setEditing(vendor);
            setOpen(true);
          }}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggle}
        />
      </section>

      <VendorModal
        key={`${open ? "open" : "closed"}-${editing?.Id ?? "new"}`}
        open={open}
        data={editing}
        cities={cities}
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
