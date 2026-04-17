"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  UserRound,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { clsx } from "clsx";
import { useEmployeeMaster } from "@/app/hooks/useMasters";
import { isMasterActive, normalizeActiveFlag } from "@/app/lib/utils/masterStatus";
import type { EmployeeRecord, EmployeeFormValues } from "@/app/types/master";

import EmployeeTable from "./components/EmployeeTable";
import EmployeeModal from "./components/EmployeeModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const makePayload = (
  form: EmployeeFormValues,
  mode: "create" | "update"
): EmployeeRecord => {
  const payload: any = {
    EmployeeId: mode === "create" ? "0" : String(form.Id || ""),
    FirstName: String(form.FirstName || "").trim(),
    LastName: String(form.LastName || "").trim(),
    EmailId: String(form.EmailId || "").trim(),
    MobileNo: String(form.MobileNo || "").trim(),
    DesignationId: String(form.DesignationId || ""),
    DepartmentId: String(form.DepartmentId || ""),
    ReportingTo: String(form.ReportingTo || "0"),
    EmployeeCode: String(form.EmployeeCode || "").trim(),
    JoiningDate: String(form.JoiningDate || "").split("T")[0],
    Password: String(form.Password || ""),
    Active: normalizeActiveFlag(form.Active ?? "1"),
  };

  if (mode === "create") {
    payload.CompanyId = "1";
  }

  return payload;
};

export default function Page() {
  const {
    data,
    departments,
    designations,
    isLoading,
    isLookupLoading,
    create,
    update,
    remove,
  } = useEmployeeMaster();
  const employees: EmployeeRecord[] = data;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const activeCount = employees.filter((e) => isMasterActive(e.Active)).length;
  const inactiveCount = employees.length - activeCount;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return employees.filter((emp) => {
      const active = isMasterActive(emp.Active);
      const matchesStatus =
        status === "all" ||
        (status === "active" && active) ||
        (status === "inactive" && !active);

      const deptName = departments.find(d => String(d.Id) === String(emp.DepartmentId))?.Name || "";
      const desigName = designations.find(d => String(d.Id) === String(emp.DesignationId))?.Name || "";

      const searchable = [
        emp.FirstName,
        emp.LastName,
        emp.EmployeeCode,
        emp.EmailId,
        emp.MobileNo,
        deptName,
        desigName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchable.includes(search));
    });
  }, [employees, departments, designations, query, status]);

  const statCards = [
    {
      label: "Total staff",
      value: employees.length,
      icon: UserRound,
      tone: "bg-indigo-50 text-indigo-600",
      detail: "Headcount recorded",
    },
    {
      label: "Active members",
      value: activeCount,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
      detail: "Ready for operations",
    },
    {
      label: "Off-duty",
      value: inactiveCount,
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-600",
      detail: "Inactive profiles",
    },
    {
      label: "Visible focus",
      value: filtered.length,
      icon: UsersRound,
      tone: "bg-cyan-50 text-cyan-600",
      detail: "Matching your criteria",
    },
  ];

  const closeModal = () => {
    create.reset();
    update.reset();
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (form: EmployeeFormValues) => {
    try {
      if (editing) {
        await update.mutateAsync(makePayload({ ...form, Id: editing.Id }, "update"));
        toast.success("Employee profile updated.");
      } else {
        await create.mutateAsync(makePayload(form, "create"));
        toast.success("New employee onboarded.");
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save employee.");
    }
  };

  const handleToggle = async (emp: EmployeeRecord) => {
    try {
      await update.mutateAsync(
        makePayload(
          { ...emp, Active: isMasterActive(emp.Active) ? "0" : "1" },
          "update"
        )
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to toggle status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("Employee record removed.");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete employee.");
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
                Workforce Control
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                Employee Management
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Manage your staff directory, organizational roles, and reporting hierarchies from one central workspace.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              disabled={isLookupLoading || departments.length === 0 || designations.length === 0}
              className="bg-premium-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <Plus size={20} className="transition-transform group-hover:rotate-90" />
              <span>Add Employee</span>
            </button>
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
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Staff Directory</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              {filtered.length} of {employees.length} employees listed
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, code, role..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as any)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300 dark:hover:border-slate-700 dark:focus:border-blue-500"
            >
              <option value="all">Full Directory</option>
              <option value="active">Active Members</option>
              <option value="inactive">Off-duty Only</option>
            </select>
          </div>
        </div>

        <EmployeeTable
          data={filtered}
          departments={departments}
          designations={designations}
          loading={isLoading}
          onEdit={(emp) => {
            setEditing(emp);
            setOpen(true);
          }}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={handleToggle}
        />
      </section>

      <EmployeeModal
        key={`${open ? "open" : "closed"}-${editing?.Id ?? "new"}`}
        open={open}
        data={editing}
        departments={departments}
        designations={designations}
        employees={employees}
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
