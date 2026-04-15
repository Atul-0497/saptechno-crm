"use client";

import { Search, Plus, Moon, LayoutGrid, Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "../../contexts/MobileMenuContext";

export const Topbar = () => {
  const { toggle } = useMobileMenu();
  const pathname = usePathname();
  const primaryAction = pathname.startsWith("/companies") ? "New Company" : "New Order";

  return (
    <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex flex-1 items-center gap-3 sm:gap-4">
        <button
          onClick={toggle}
          className="-ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="hidden max-w-lg flex-1 sm:flex">
          <div className="group flex w-full max-w-md items-center rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2.5 transition-colors hover:bg-gray-100/70">
            <Search size={18} className="text-gray-400 transition-colors group-hover:text-cyan-600" />
            <input
              className="ml-3 w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              placeholder="Search anything..."
            />
            <div className="hidden items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 md:flex">
              <span>Ctrl K</span>
            </div>
          </div>
        </div>

        <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:hidden">
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:px-5 sm:py-2.5">
          <Plus size={16} />
          <span className="hidden sm:inline">{primaryAction}</span>
        </button>

        <div className="flex items-center gap-2 text-gray-400 sm:gap-4">
          <button className="hidden transition-colors hover:text-gray-600 sm:block">
            <Moon size={20} />
          </button>
          <button className="hidden transition-colors hover:text-gray-600 md:block">
            <LayoutGrid size={20} />
          </button>
          <button className="relative p-1 transition-colors hover:text-gray-600 md:p-0">
            <Bell size={20} />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500 sm:-translate-y-0.5 sm:translate-x-0.5" />
          </button>
        </div>

        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 sm:h-10 sm:w-10 sm:text-base">
          AS
        </button>
      </div>
    </header>
  );
};
