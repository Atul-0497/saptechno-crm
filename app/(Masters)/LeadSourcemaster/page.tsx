"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useLeadSourceMaster } from "@/app/hooks/useMasters";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { LeadSourceRecord, LeadSourceFormValues } from "@/app/types/master";

import LeadSourceTable from "./components/LeadSourceTable";
import LeadSourceModal from "./components/LeadSourceModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Page() {
  const { data, isLoading, create, update, remove } = useLeadSourceMaster();
  const sources: LeadSourceRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeadSourceRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = sources.filter((s) => isMasterActive(s.Active)).length;
  const inactiveCount = sources.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return sources.filter((item) => {
      const active = isMasterActive(item.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const searchable = (item.Name || "").toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [sources, query, status]);

  const statCards = [
    {
      label: "Total sources",
      value: sources.length,
      icon: Link,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Lead entry points",
    },
    {
      label: "Active channels",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Currently in use",
    },
    {
      label: "Deprecated",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Disabled sources",
    },
    {
      label: "Filtered view",
      value: filtered.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Current search results",
    },
  ];

  const closeModal = () => {
    create.reset();
    update.reset();
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: LeadSourceFormValues) => {
    try {
      if (editing) {
        await update.mutateAsync({ ...form, LeadSourceId: editing.LeadSourceId ?? editing.Id } as LeadSourceRecord);
        toast.success("Lead source updated.");
      } else {
        await create.mutateAsync(form as LeadSourceRecord);
        toast.success("Lead source created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save lead source.");
    }
  };

  const handleToggle = async (item: LeadSourceRecord) => {
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
      toast.success("Lead source deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete lead source.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm text-left">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-left">
            <div className="max-w-2xl text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                <Sparkles size={14} />
                Acquisition master
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 text-left">
                Lead source management
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500 text-left">
                Identify and manage the various channels through which leads enter your CRM system.
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
              Add source
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 text-left">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 text-left">
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-500 text-left">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-950 text-left">{card.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${card.tone}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-left">{card.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm text-left">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between text-left">
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-950 text-left">Listings</h2>
            <p className="text-sm text-gray-500 text-left">
              {filtered.length} of {sources.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search source name..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-medium"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 cursor-pointer"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>

        <LeadSourceTable
          data={filtered}
          loading={isLoading}
          onEdit={(item) => {
            setEditing(item);
            setOpen(true);
          }}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggle}
        />
      </section>

      <LeadSourceModal
        key={`${open ? "open" : "closed"}-${editing?.Id ?? "new"}`}
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
