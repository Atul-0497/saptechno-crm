"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Zap,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useMobileMenu } from "../../contexts/MobileMenuContext";
import { useCustomization } from "../../contexts/CustomizationContext";
import { 
  TOP_NAV_ITEMS as topItems, 
  NAV_SECTIONS as sections,
  type NavItem as SidebarItem,
  type NavSection as SidebarSection
} from "../../constants/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();
  const { layout } = useCustomization();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.name, Boolean(section.defaultOpen)]))
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectivelyCollapsed = isMobile ? false : isCollapsed;

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (pathname === "/" && href === "/dashboard");
  };

  const sectionHasActiveChild = (section: SidebarSection) =>
    section.children?.some((item) => isActive(item.href)) ?? false;

  const toggleSection = (name: string) => {
    setOpenSections((current) => ({ ...current, [name]: !current[name] }));
  };

  const handleLinkClick = () => {
    close();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 transition-opacity md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={clsx(
          "fixed z-50 flex h-full shrink-0 flex-col overflow-visible bg-slate-950 text-slate-400 shadow-2xl transition-all duration-300 ease-in-out dark:bg-slate-950",
          layout === "sidebar" ? "md:relative md:translate-x-0" : "md:hidden",
          effectivelyCollapsed ? "md:w-[80px]" : "w-[260px] md:w-[260px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsCollapsed((current) => !current)}
          className="absolute -right-3 top-6 z-20 hidden rounded-full border border-slate-800 bg-slate-950 p-1.5 text-white transition-all hover:scale-110 hover:bg-slate-900 md:block"
          aria-label={effectivelyCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {effectivelyCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <Link
          href="/"
          onClick={isMobile ? close : undefined}
          className={clsx(
            "flex h-[76px] shrink-0 items-center gap-3 overflow-hidden border-b border-slate-900 px-6",
            effectivelyCollapsed && "justify-center px-0"
          )}
        >
          <div className="bg-premium-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Zap size={22} fill="currentColor" />
          </div>
          {!effectivelyCollapsed && (
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">Saptechno</span>
          )}
        </Link>

        <nav
          className={clsx(
            "flex-1 overflow-y-auto pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            effectivelyCollapsed ? "px-4" : "px-4"
          )}
        >
          {effectivelyCollapsed ? (
            <ul className="space-y-4">
              {[...topItems, ...sections].map((item, index) => {
                const IconComponent = item.icon;
                const active = "children" in item ? isActive(item.href) || sectionHasActiveChild(item) : isActive(item.href);

                return (
                  <li key={item.name}>
                    {index === 4 || index === 10 ? <div className="mx-auto mb-6 h-px w-8 bg-slate-800/50" /> : null}
                    <Link
                      href={"href" in item && item.href ? item.href : "#"}
                      title={item.name}
                      onClick={(e) => {
                        if (effectivelyCollapsed && "children" in item) {
                          e.preventDefault();
                          setIsCollapsed(false);
                          setOpenSections((current) => ({ ...current, [item.name]: true }));
                        } else {
                          handleLinkClick();
                        }
                      }}
                      className={clsx(
                        "mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200",
                        active 
                          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                          : "text-slate-500 hover:bg-slate-900 hover:text-white hover:shadow-lg"
                      )}
                    >
                      <IconComponent size={20} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <div className="mb-4 px-4 text-[11px] font-extrabold tracking-widest text-slate-500 uppercase dark:text-slate-400">OVERVIEW</div>

              <ul className="space-y-1.5">
                {topItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={clsx(
                          "group flex h-11 items-center gap-3 rounded-lg px-4 py-2 text-[15px] font-semibold transition-all duration-200",
                          active 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-slate-400 hover:bg-slate-900 hover:text-white dark:text-slate-200"
                        )}
                      >
                        <IconComponent
                          size={18}
                          className={clsx(
                            "shrink-0 transition-colors",
                            !active && "text-slate-500 group-hover:text-primary"
                          )}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-6 h-px bg-slate-900" />

              <div className="mb-4 px-2">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-2.5 ring-1 ring-slate-800">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                    CT
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-white">CRM Teamspace</div>
                    <div className="text-[10px] text-slate-500">Free Plan</div>
                  </div>
                  <ChevronDown size={14} className="text-slate-600" />
                </div>
              </div>

              <ul className="space-y-1">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  const open = Boolean(openSections[section.name]);
                  const active = isActive(section.href) || sectionHasActiveChild(section);
                  const hasChildren = Boolean(section.children?.length);
                  const content = (
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={clsx(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                        active ? "bg-primary/20 text-primary" : "text-slate-500 group-hover:text-slate-300"
                      )}>
                        <IconComponent size={18} />
                      </div>
                      <span className="truncate py-2">
                        {section.name}
                        {section.name === "Workqueue" && (
                          <span className="ml-1.5 rounded-full bg-yellow-500/10 px-1.5 py-0.5 text-[8px] font-bold text-yellow-500 ring-1 ring-yellow-500/20">
                            NEW
                          </span>
                        )}
                      </span>
                    </div>
                  );

                  return (
                    <li key={section.name} className="px-1">
                      {hasChildren ? (
                        <div className="group">
                          <button
                            onClick={() => toggleSection(section.name)}
                            className={clsx(
                              "flex w-full items-center justify-between rounded-lg px-2 text-left text-[15px] font-semibold transition-all duration-200",
                              active 
                                ? "text-white" 
                                : "text-slate-400 hover:bg-slate-900/50 hover:text-white dark:text-slate-200"
                            )}
                          >
                            {content}
                            <div className="pr-1">
                              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={section.href ?? "#"}
                          onClick={handleLinkClick}
                          className={clsx(
                            "flex items-center justify-between rounded-lg px-2 text-[15px] font-semibold transition-all duration-200",
                            active ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-900/50 hover:text-white dark:text-slate-200"
                          )}
                        >
                          {content}
                        </Link>
                      )}

                      {hasChildren && open && (
                        <ul className="mt-1 space-y-0.5 border-l border-slate-800 ml-6 pb-2 pl-2">
                          {section.children?.map((item) => {
                            const ChildIcon = item.icon;
                            const childActive = isActive(item.href);

                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={handleLinkClick}
                                  className={clsx(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-all duration-200",
                                    childActive 
                                      ? "bg-slate-900 text-primary font-bold" 
                                      : "text-slate-500 hover:text-slate-100 dark:text-slate-300"
                                  )}
                                >
                                  <ChildIcon size={14} className={clsx(
                                    "shrink-0",
                                    childActive ? "text-primary" : "text-slate-600"
                                  )} />
                                  <span className="truncate">{item.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>

        <div
          className={clsx(
            "mt-auto flex shrink-0 border-t border-slate-900 p-4",
            effectivelyCollapsed ? "flex-col items-center gap-6" : "items-center justify-between"
          )}
        >
          <div className={clsx("flex min-w-0 items-center", effectivelyCollapsed ? "justify-center" : "gap-3")}>
            <div className="bg-premium-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg shadow-blue-500/20 ring-2 ring-slate-900">
              AS
            </div>
            {!effectivelyCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">Atul</div>
                <div className="truncate text-[10px] font-medium text-slate-500 uppercase tracking-tighter">System Admin</div>
              </div>
            )}
          </div>
          <button 
            className="group flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-500" 
            title="Logout"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
