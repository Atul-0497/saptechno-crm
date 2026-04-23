"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { clsx } from "clsx";
import { useSimpleMaster } from "@/app/hooks/useMasters";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { DesignationRecord } from "@/app/types/master";
import DesignationTable from "./components/DesignationTable";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Page() {
  const router = useRouter();
  const { data, isLoading, update, remove } = useSimpleMaster<DesignationRecord>("designation");
  const designations: DesignationRecord[] = data;

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = designations.filter((d) => isMasterActive(d.Active)).length;
  const inactiveCount = designations.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return designations.filter((desig) => {
      const active = isMasterActive(desig.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const searchable = [desig.DesignationName, desig.Name, desig.DesignationLevel]
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

  const handleToggle = async (item: DesignationRecord) => {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
        <div className="border-b border-gray-100 px-6 py-6 dark:border-slate-800 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
                <Sparkles size={14} className="animate-pulse" />
                Corporate Hierarchy
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Designation Master
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Define functional job titles and seniority levels within the organization.
              </p>
            </div>

            <Link
              href="/DesignationMaster/add"
              className="bg-premium-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <Plus size={20} className="transition-transform group-hover:rotate-90" />
              <span>Add Designation</span>
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
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Active Designations</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Showing {filtered.length} of {designations.length} records shown
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or level..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300 dark:hover:border-slate-700 dark:focus:border-blue-500"
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
            router.push(`/DesignationMaster/edit/${item.Id}`);
          }}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggle}
        />
      </section>

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={remove.isPending}
      />
    </div>
  );
}
