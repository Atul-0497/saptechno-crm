"use client";

import { useState, useMemo } from "react";
import { Company } from "@/app/types/company";
import { Pencil, Trash2, ArrowUpDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  data: Company[];
  loading: boolean;
  onEdit: (c: Company) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export default function CompanyTable({
  data,
  loading,
  onEdit,
  onDelete,
  onBulkDelete,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Company>("CompanyId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 6;

  // 🔥 COLUMN VISIBILITY
  const [columns, setColumns] = useState({
    CompanyId: true,
    Name: true,
    Email: true,
    Mobile: true,
    Active: true,
  });

  const toggleColumn = (key: keyof typeof columns) => {
    setColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 🔍 FILTER
  const filtered = useMemo(() => {
    return data
      .filter((c) =>
        c.Name?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((c) =>
        statusFilter ? c.Active === statusFilter : true
      );
  }, [data, search, statusFilter]);

  // 🔄 SORT
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = (a[sortKey] || "").toString().toLowerCase();
      const valB = (b[sortKey] || "").toString().toLowerCase();

      return sortDir === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filtered, sortKey, sortDir]);

  // 📄 PAGINATION
  const paginated = sorted.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  // 🔁 SORT HANDLER
  const handleSort = (key: keyof Company) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // ☑️ SELECT
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === paginated.length) {
      setSelected([]);
    } else {
      setSelected(paginated.map((c) => c.CompanyId));
    }
  };

  // 📊 EXPORT
  const handleExport = () => {
    const exportData = sorted.map((c) => ({
      ID: c.CompanyId,
      Name: c.Name,
      Email: c.Email,
      Mobile: c.Mobile,
      Status: c.Active === "1" ? "Active" : "Inactive",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "companies.xlsx");
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow border p-5 space-y-5">

      {/* 🔥 HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

        <div className="flex gap-3 w-full">
          <input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-xl"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            Export
          </button>

          {selected.length > 0 && (
            <button
              onClick={() => onBulkDelete?.(selected)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
            >
              Delete ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* ⚙️ COLUMN TOGGLE */}
      <div className="flex justify-end">
        <details className="relative">
          <summary className="cursor-pointer border px-3 py-2 rounded-xl flex items-center gap-2 text-sm">
            <Settings size={14} /> Columns
          </summary>

          <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-xl p-3 space-y-2 z-50">
            {Object.keys(columns).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={columns[key as keyof typeof columns]}
                  onChange={() =>
                    toggleColumn(key as keyof typeof columns)
                  }
                />
                {key}
              </label>
            ))}
          </div>
        </details>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === paginated.length}
                  onChange={toggleSelectAll}
                />
              </th>

              {columns.CompanyId && (
                <th className="p-4 cursor-pointer" onClick={() => handleSort("CompanyId")}>
                  ID <ArrowUpDown size={14} />
                </th>
              )}

              {columns.Name && (
                <th className="p-4 cursor-pointer" onClick={() => handleSort("Name")}>
                  Name <ArrowUpDown size={14} />
                </th>
              )}

              {columns.Email && <th className="p-4">Email</th>}
              {columns.Mobile && <th className="p-4">Mobile</th>}

              {columns.Active && (
                <th className="p-4 cursor-pointer" onClick={() => handleSort("Active")}>
                  Status <ArrowUpDown size={14} />
                </th>
              )}

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((c) => (
              <tr
                key={c.CompanyId}
                className="hover:bg-gray-50 cursor-pointer transition"
                onClick={() => router.push(`/companies/${c.CompanyId}`)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(c.CompanyId)}
                    onChange={() => toggleSelect(c.CompanyId)}
                  />
                </td>

                {columns.CompanyId && <td className="p-4">{c.CompanyId}</td>}
                {columns.Name && <td className="p-4 font-medium">{c.Name}</td>}
                {columns.Email && <td className="p-4">{c.Email}</td>}
                {columns.Mobile && <td className="p-4">{c.Mobile}</td>}

                {columns.Active && (
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        c.Active === "1"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {c.Active === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                )}

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(c);
                        console.log("CLICK Update", c);
                        
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.CompanyId);
                        console.log("CLICK DELETE", c.CompanyId);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center border-t pt-3">

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}