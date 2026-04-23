"use client";

import { Edit2, MoreHorizontal, Power, Trash2 } from "lucide-react";
import type { 
  PincodeRecord, 
  CityRecord, 
  StateRecord, 
  CountryRecord 
} from "@/app/types/master";
import { isMasterActive } from "@/app/lib/utils/masterStatus";

type PincodeTableProps = {
  data: PincodeRecord[];
  cities: CityRecord[];
  states: StateRecord[];
  countries: CountryRecord[];
  loading: boolean;
  onEdit: (p: PincodeRecord) => void;
  onDelete: (id: string) => void;
  onToggleActive: (p: PincodeRecord) => void;
};

export default function PincodeTable({
  data,
  cities,
  states,
  countries,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}: PincodeTableProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <MapPinOff size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">No pin codes found</p>
        <p className="text-sm">Try adjusting your search or add a new code.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:bg-slate-800/50 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4">Pin Code</th>
            <th className="px-6 py-4">City</th>
            <th className="px-6 py-4">State</th>
            <th className="px-6 py-4">Country</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {data.map((item) => {
            const active = isMasterActive(item.Active);
            const city = cities.find(c => String(c.CityId ?? c.Id) === String(item.CityId));
            const state = states.find(s => String(s.StateId ?? s.Id) === String(item.StateId));
            const country = countries.find(c => String(c.CountryId ?? c.Id) === String(item.CountryId));

            return (
              <tr
                key={String(item.PincodeId ?? item.Id)}
                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/30"
              >
                <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-950 dark:text-white">
                  {item.Pincode}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                  {city?.CityName || "—"}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                  {state?.StateName || "—"}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                  {country?.CountryName || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-600" : "bg-gray-400"}`} />
                    {active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleActive(item)}
                      title={active ? "Deactivate" : "Activate"}
                      className={`rounded-lg p-2 transition-colors ${
                        active
                          ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(String(item.PincodeId ?? item.Id))}
                      className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MapPinOff({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.75 18.945a4 4 0 0 1-5.833-2.126" />
      <path d="M15 11.085A3 3 0 0 0 13.31 9" />
      <path d="M17.83 12.17a8 8 0 0 0-5.83-9.17" />
      <path d="M2 2l20 20" />
      <path d="M8.47 2.74c.33-.24.7-.44 1.1-.57" />
      <path d="M9 11v1" />
    </svg>
  );
}
