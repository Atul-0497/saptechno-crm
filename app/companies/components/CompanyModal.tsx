"use client";

import { useEffect, useState } from "react";

export default function CompanyModal({
  open,
  data,
  onClose,
  onSubmit,
}: any) {
  const [form, setForm] = useState<any>({
    Name: "",
    Email: "",
    Mobile: "",
    Address: "",
    PlanStart: "",
    PlanEnd: "",
    Active: "1",
  });

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        PlanStart: data.PlanStart?.split("T")[0] || "",
        PlanEnd: data.PlanEnd?.split("T")[0] || "",
        Active: String(data.Active || "1"),
      });
    }
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="bg-white p-6 rounded space-y-3 w-[400px]"
      >
        <input
          placeholder="Name"
          value={form.Name}
          onChange={(e) =>
            setForm({ ...form, Name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.Email}
          onChange={(e) =>
            setForm({ ...form, Email: e.target.value })
          }
        />

        <input
          placeholder="Mobile"
          value={form.Mobile}
          onChange={(e) =>
            setForm({ ...form, Mobile: e.target.value })
          }
        />

        <input
          placeholder="Address"
          value={form.Address}
          onChange={(e) =>
            setForm({ ...form, Address: e.target.value })
          }
        />

        <input
          type="date"
          value={form.PlanStart}
          onChange={(e) =>
            setForm({ ...form, PlanStart: e.target.value })
          }
        />

        <input
          type="date"
          value={form.PlanEnd}
          onChange={(e) =>
            setForm({ ...form, PlanEnd: e.target.value })
          }
        />

        <select
          value={form.Active}
          onChange={(e) =>
            setForm({ ...form, Active: e.target.value })
          }
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit" className="bg-blue-600 text-white px-3 py-1">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}