"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Map,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useStateMaster } from "@/app/hooks/useMasters";
import { isMasterActive } from "@/app/lib/utils/masterStatus";
import type { StateRecord, StateFormValues } from "@/app/types/master";

import StateTable from "./components/StateTable";
import StateModal from "./components/StateModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function Page() {
  const { countries, data, isLoading, create, update, remove } = useStateMaster();
  const states: StateRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StateRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = states.filter((s) => isMasterActive(s.Active)).length;
  const inactiveCount = states.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return states.filter((item) => {
      const active = isMasterActive(item.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const countryName = countries.find(c => String(c.CountryId ?? c.Id) === String(item.CountryId))?.CountryName || "";
      const searchable = [
        item.StateName,
        countryName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [states, countries, query, status]);

  const statCards = [
    {
      label: "States / Provinces",
      value: states.length,
      icon: Map,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Regional records",
    },
    {
      label: "Active regions",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Available for selection",
    },
    {
      label: "Hidden",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Inactive states",
    },
    {
      label: "View matches",
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

  const handleSubmit = async (form: StateFormValues) => {
    try {
      const idValue = editing ? String(editing.StateId ?? editing.Id) : "0";
      const payload: any = {
        StateId:   idValue,
        StateName: String(form.StateName ?? "").trim(),
        CountryId: String(form.CountryId ?? ""),
        Active:    form.Active,
      };

      if (editing) {
        await update.mutateAsync(payload);
        toast.success("State updated.");
      } else {
        await create.mutateAsync(payload);
        toast.success("State created.");
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save state.");
    }
  };

  const handleToggle = async (state: StateRecord) => {
    try {
      await update.mutateAsync({
        ...state,
        StateId: String(state.StateId ?? state.Id),
        Active: isMasterActive(state.Active) ? "0" : "1",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to toggle status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("State deleted.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete state.");
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
                Regional settings
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 text-left font-bold">
                State management
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500 text-left font-medium">
                Manage states and provinces mapped to countries for precise location tracking.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              disabled={countries.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 font-bold"
            >
              <Plus size={18} />
              Add state
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
                    <p className="text-sm font-medium text-gray-500 text-left font-bold">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-950 text-left font-bold">{card.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${card.tone}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-left font-medium">{card.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm text-left">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between text-left">
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-950 text-left font-bold">Registry</h2>
            <p className="text-sm text-gray-500 text-left font-medium">
              {filtered.length} of {states.length} states shown
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search state or country..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 font-medium font-bold"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 cursor-pointer font-bold"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>

        <StateTable
          data={filtered}
          countries={countries}
          loading={isLoading}
          onEdit={(s) => {
            setEditing(s);
            setOpen(true);
          }}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggle}
        />
      </section>

      <StateModal
        key={`${open ? "open" : "closed"}-${String(editing?.StateId ?? editing?.Id ?? "new")}`}
        open={open}
        data={editing}
        countries={countries}
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
