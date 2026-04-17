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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                <Sparkles size={14} />
                Workforce control
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 text-left">
                Employee management
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500 text-left">
                Manage your staff directory, organizational roles, and reporting hierarchies from one central workspace.
              </p>
            </div>

            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              disabled={isLookupLoading || departments.length === 0 || designations.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            >
              <Plus size={18} />
              Add employee
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-lg border border-gray-200 bg-gray-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
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
            <h2 className="text-base font-semibold text-gray-950 text-left">Staff directory</h2>
            <p className="text-sm text-gray-500 text-left">
              {filtered.length} of {employees.length} employees listed
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, code, role..."
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
