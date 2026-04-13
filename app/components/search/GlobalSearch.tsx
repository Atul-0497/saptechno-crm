"use client";

import { useState } from "react";
import { debounce } from "lodash"; 
import { useRouter } from "next/navigation";
import { searchAPI } from "../../lib/api/search";

export default function GlobalSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const search = debounce(async (q: string) => {
    if (!q) return setResults([]);

    const data = await searchAPI.searchCompanies(q);
    setResults(data || []);
    setOpen(true);
  }, 400);

  return (
    <div className="relative w-full max-w-md">
      <input
        placeholder="Search companies..."
        onChange={(e) => search(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl"
      />

      {open && results.length > 0 && (
        <div className="absolute bg-white w-full mt-2 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.CompanyId}
              onClick={() => {
                router.push("/companies");
                setOpen(false);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{item.Name}</div>
              <div className="text-xs text-gray-500">
                {item.Email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}