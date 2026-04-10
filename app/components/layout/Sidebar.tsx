"use client";

import {
  LayoutGrid,
  Building2,
  BarChart2,
  ShoppingBag,
  Shield,
  Rocket,
  LineChart,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  LucideIcon
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuItem, MenuGroup } from "../../types/layout.types";

const menuGroups: MenuGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { name: "Companies", href: "/companies", icon: Building },
      { name: "Analytics", href: "/analytics", icon: BarChart2 },
      { name: "eCommerce", href: "/ecommerce", icon: ShoppingBag },
      { name: "CRM", href: "/crm", icon: Shield },
      { name: "SaaS", href: "/saas", icon: Rocket },
      { name: "Charts", href: "/charts", icon: LineChart },
    ],
  },
  {
    title: "COMMERCE",
    items: [
      { name: "Orders", href: "/orders", icon: ShoppingCart, badge: 12 },
      { name: "Products", href: "/products", icon: Package },
      { name: "Customers", href: "/companies", icon: Users },
      { name: "Invoices", href: "/invoices", icon: FileText },
    ],
  },
  {
    title: "APPS",
    items: [
      { name: "Mail", href: "/mail", icon: Mail },
      { name: "Chat", href: "/chat", icon: MessageSquare },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "bg-[#111827] text-gray-400 flex flex-col relative h-full shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      {/* Collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-[#111827] text-white p-1 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors z-20"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <Link href="/" className="p-6 flex items-center gap-3 overflow-hidden h-[80px] shrink-0">
        <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
          <Zap size={20} fill="currentColor" />
        </div>
        {!isCollapsed && (
          <div className="whitespace-nowrap flex-1 opacity-100 animate-in fade-in duration-300">
            <div className="text-white text-xl font-semibold leading-tight">Saptechno-CRM</div>
          </div>
        )}
      </Link>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto overflow-x-hidden pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {isCollapsed ? (
              <div className="w-full flex justify-center mb-3 mt-1">
                <div className="w-6 border-t-2 border-gray-700/50 rounded-full"></div>
              </div>
            ) : (
              <div className="w-full text-left text-[11px] font-semibold text-gray-500 mb-3 px-3 tracking-wider whitespace-nowrap">
                {group.title}
              </div>
            )}

            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.name : undefined}
                      className={clsx(
                        "flex items-center rounded-lg transition-colors group relative",
                        isCollapsed ? "justify-center p-3" : "justify-between px-3 py-2.5",
                        isActive
                          ? "bg-gray-800/50 text-blue-500"
                          : "hover:bg-gray-800/50 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={20}
                          className={clsx(
                            "shrink-0 transition-colors",
                            isActive ? "text-blue-500" : "text-gray-400 group-hover:text-white"
                          )}
                        />
                        {!isCollapsed && (
                          <span className={clsx("whitespace-nowrap", isActive ? "font-medium" : "font-normal")}>
                            {item.name}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      )}

                      {/* Optional dot indicator for badges when collapsed */}
                      {isCollapsed && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={clsx(
        "p-2 my-3 flex mt-auto shrink-0 transition-all duration-300",
        isCollapsed ? "flex-col items-center gap-3 mx-1" : "flex-row items-center justify-between mx-3"
      )}>
        <div className={clsx(
          "flex items-center hover:bg-gray-800/50 cursor-pointer transition-colors rounded-lg overflow-hidden",
          isCollapsed ? "p-1 justify-center w-full" : "gap-2.5 p-1.5 min-w-0"
        )}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
            AS
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-[13px] font-medium text-white truncate leading-tight">Atul</div>
              <div className="text-[11px] text-gray-500 truncate mt-0.5">Admin</div>
            </div>
          )}
        </div>
        <button
          title="Logout"
          className={clsx(
            "text-gray-400 hover:text-white rounded-md hover:bg-gray-800/50 transition-colors shrink-0",
            isCollapsed ? "p-2" : "p-1.5"
          )}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};