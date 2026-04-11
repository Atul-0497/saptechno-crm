"use client";

import { Search, Plus, Moon, LayoutGrid, Bell, Menu } from "lucide-react";
import { useMobileMenu } from "../../contexts/MobileMenuContext";

export const Topbar = () => {
  const { toggle } = useMobileMenu();

  return (
    <header className="h-[76px] bg-white border-b flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={toggle}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Left side - Search */}
        <div className="hidden sm:flex flex-1 max-w-lg">
          <div className="flex items-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors border px-4 py-2.5 rounded-full w-full max-w-md group">
            <Search size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            <input
              className="bg-transparent outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400"
              placeholder="Search anything..."
            />
            <div className="hidden md:flex items-center gap-1 border rounded px-1.5 py-0.5 text-[10px] text-gray-400 font-medium">
              <span>⌘K</span>
            </div>
          </div>
        </div>
        
        {/* Mobile search icon */}
        <button className="sm:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Search size={20} />
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">New Order</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4 text-gray-400">
          <button className="hidden sm:block hover:text-gray-600 transition-colors">
            <Moon size={20} />
          </button>
          <button className="hidden md:block hover:text-gray-600 transition-colors">
            <LayoutGrid size={20} />
          </button>
          <button className="hover:text-gray-600 transition-colors relative p-1 md:p-0">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white sm:translate-x-0.5 sm:-translate-y-0.5"></span>
          </button>
        </div>

        {/* User profile */}
        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 font-medium flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 text-xs sm:text-base">
          AS
        </button>
      </div>
    </header>
  );
};