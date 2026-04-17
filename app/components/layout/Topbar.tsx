"use client";

import { Search, Plus, Moon, Sun, LayoutGrid, Bell, Menu, Palette, Zap, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "../../contexts/MobileMenuContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { CustomizeDrawer } from "./CustomizeDrawer";
import { useCustomization } from "../../contexts/CustomizationContext";
import { NAV_SECTIONS, TOP_NAV_ITEMS } from "../../constants/navigation";

export const Topbar = () => {
  const { toggle } = useMobileMenu();
  const { theme, setTheme } = useTheme();
  const { layout } = useCustomization();
  const [mounted, setMounted] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const primaryAction = pathname.startsWith("/CompanyMaster") ? "New Company" : "New Order";

  useEffect(() => setMounted(true), []);

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (pathname === "/" && href === "/dashboard");
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur transition-all dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Always show Mobile Menu Trigger on small screens */}
          <button
            onClick={toggle}
            className="-ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-900 md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Logo - Link style changes based on layout */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className={clsx(
              "bg-premium-gradient flex shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95",
              layout === "sidebar" ? "h-8 w-8 md:hidden" : "h-9 w-9"
            )}>
              <Zap size={layout === "sidebar" ? 18 : 20} fill="currentColor" />
            </div>
            {(layout === "topnav" || layout === "sidebar") && (
              <span className={clsx(
                "font-bold tracking-tight text-gray-950 dark:text-white",
                layout === "sidebar" ? "text-lg md:hidden" : "hidden text-xl lg:block"
              )}>
                Saptechno
              </span>
            )}
          </Link>

          {/* Top Navigation Links - Horizontal Menu */}
          {layout === "topnav" && (
            <nav className="hidden items-center gap-1.5 md:flex">
              {TOP_NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "rounded-lg px-3 py-2 text-[14px] font-bold transition-all",
                    isActive(item.href)
                      ? "text-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {NAV_SECTIONS.slice(0, 5).map((section) => (
                <div
                  key={section.name}
                  className="relative h-full"
                  onMouseEnter={() => setActiveDropdown(section.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={clsx(
                      "flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-bold transition-all",
                      activeDropdown === section.name
                        ? "text-primary bg-primary/5"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                    )}
                  >
                    <span>{section.name}</span>
                    <ChevronDown size={14} className={clsx("transition-transform duration-200", activeDropdown === section.name && "rotate-180")} />
                  </button>

                  <div className={clsx(
                    "absolute left-0 top-full z-50 pt-1 transition-all duration-200",
                    activeDropdown === section.name ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                  )}>
                    <div className="w-56 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                      <div className="grid gap-0.5">
                        {section.children?.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={clsx(
                              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all",
                              isActive(child.href)
                                ? "bg-primary/5 text-primary"
                                : "text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                            )}
                          >
                            <child.icon size={16} className={clsx(isActive(child.href) ? "text-primary" : "text-gray-400")} />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          )}

          {layout === "sidebar" && (
            <div className="hidden max-w-sm flex-1 sm:flex lg:w-72">
              <div className="group flex w-full items-center rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2 transition-all hover:border-primary/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-primary/50 dark:hover:bg-slate-900">
                <Search size={17} className="text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500" />
                <input
                  className="ml-2.5 w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-400"
                  placeholder="Search anything..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button className="bg-premium-gradient flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-5 sm:py-2.5">
            <Plus size={18} />
            <span className="hidden sm:inline">{primaryAction}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 sm:gap-4">
            <button
              disabled={!mounted}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-900 dark:hover:text-gray-300"
            >
              {mounted ? (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />) : <div className="h-5 w-5 rounded-full border-2 border-transparent" />}
            </button>

            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-900 dark:hover:text-cyan-400"
              title="Customize Theme"
            >
              <Palette size={20} />
            </button>

            <button className="hidden h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-900 dark:hover:text-gray-300 md:flex">
              <LayoutGrid size={20} />
            </button>

            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-white dark:hover:bg-slate-900 dark:hover:text-cyan-400">
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-slate-950" />
            </button>
          </div>

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary ring-2 ring-white transition-all hover:bg-primary/20 dark:bg-primary/90 dark:text-white dark:ring-slate-950 sm:h-10 sm:w-10">
            AS
          </button>
        </div>
      </header>

      <CustomizeDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />
    </>
  );
};
