"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Briefcase,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useSimpleMaster } from "@/app/hooks/useMasters";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { SimpleMasterRecord, SimpleMasterFormValues } from "@/app/types/master";

import DesignationTable from "./components/DesignationTable";
import DesignationModal from "./components/DesignationModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Page() {
  const { data, isLoading, create, update, remove } = useSimpleMaster("designation");
  const designations: SimpleMasterRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SimpleMasterRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = designations.filter((d) => isMasterActive(d.Active)).length;
  const inactiveCount = designations.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return designations.filter((item) => {
      const active = isMasterActive(item.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const searchable = [item.Name, item.Level]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [designations, query, status]);

  const statCards = [
    {
      label: "Total roles",
      value: designations.length,
      icon: Briefcase,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Positions defined",
    },
    {
      label: "Operational",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Active designations",
    },
    {
      label: "On hold",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Inactive roles",
    },
    {
      label: "Filtered",
      value: filtered.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Result set size",
    },
  ];

  const closeModal = () => {
    create.reset();
    update.reset();
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: SimpleMasterFormValues) => {
    try {
      if (editing) {
        await update.mutateAsync({ ...form, Id: editing.Id } as SimpleMasterRecord);
        toast.success("Designation updated.");
      } else {
        await create.mutateAsync(form as SimpleMasterRecord);
        toast.success("Designation created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save designation.");
    }
  };

  const handleToggle = async (item: SimpleMasterRecord) => {
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
      toast.success("Designation deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete designation.");
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
                Corporate hierarchy
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                Designation master
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Define functional job titles and seniority levels within the organization.
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
              Add designation
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
              {filtered.length} of {designations.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or level..."
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

        <DesignationTable
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

      <DesignationModal
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
