"use client";

import {
  Activity,
  BarChart3,
  Box,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDot,
  ClipboardList,
  FileBox,
  FileText,
  Folder,
  Factory,
  Globe,
  Handshake,
  Home,
  LogOut,
  Megaphone,
  MoreHorizontal,
  Package,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  Tags,
  UserCircle,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { useMobileMenu } from "../../contexts/MobileMenuContext";

type Icon = ComponentType<{ size?: number; className?: string }>;

type SidebarItem = {
  name: string;
  href: string;
  icon: Icon;
};

type SidebarSection = {
  name: string;
  icon: Icon;
  href?: string;
  defaultOpen?: boolean;
  actions?: boolean;
  children?: SidebarItem[];
};

const topItems: SidebarItem[] = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "My Requests", href: "/requests", icon: BriefcaseBusiness },
];

const sections: SidebarSection[] = [
  {
    name: "Workqueue",
    icon: ClipboardList,
    href: "/workqueue",
  },
  {
    name: "Companies",
    icon: Folder,
    defaultOpen: true,
    actions: true,
    children: [
      { name: "Company", href: "/CompanyMaster", icon: Building2 },
      { name: "Leads", href: "/leads", icon: CircleDot },
      { name: "Contacts", href: "/contacts", icon: UserCircle },
      { name: "Deals", href: "/deals", icon: WalletCards },
      { name: "Forecasts", href: "/forecasts", icon: FileText },
      { name: "Documents", href: "/documents", icon: FileBox },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    ],
  },
  {
    name: "Masters",
    icon: Folder,
    defaultOpen: true,
    actions: true,
    children: [
      { name: "Company", href: "/CompanyMaster", icon: Building2 },
      { name: "Department", href: "/DepartmentMaster", icon: Building2 },
      { name: "Designation", href: "/DesignationMaster", icon: BriefcaseBusiness },
      { name: "Employee", href: "/EmployeesMaster", icon: Users },
      { name: "Vendor", href: "/VendorMaster", icon: Building2 },
      { name: "Product", href: "/Productmaster", icon: Package },
      { name: "Dealer", href: "/DealerMaster", icon: Handshake },
      { name: "Lead Source", href: "/LeadSourcemaster", icon: Megaphone },
      { name: "Industry", href: "/IndustryMaster", icon: Factory },
      { name: "Country", href: "/Location/Country", icon: Globe },
      { name: "State", href: "/Location/State", icon: Globe },
      { name: "City", href: "/Location/City", icon: Globe },
    ],
  },
  {
    name: "Sales",
    icon: Folder,
    defaultOpen: true,
    actions: true,
    children: [
      { name: "Leads", href: "/leads", icon: CircleDot },
      { name: "Contacts", href: "/contacts", icon: UserCircle },
      { name: "Companies", href: "/CompanyMaster", icon: Building2 },
      { name: "Deals", href: "/deals", icon: WalletCards },
      { name: "Forecasts", href: "/forecasts", icon: FileText },
      { name: "Documents", href: "/documents", icon: FileBox },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    ],
  },
  {
    name: "Activities",
    icon: Folder,
    children: [
      { name: "Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Meetings", href: "/meetings", icon: CalendarDays },
      { name: "Calls", href: "/calls", icon: Activity },
    ],
  },
  {
    name: "Inventory",
    icon: Folder,
    children: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Price Books", href: "/price-books", icon: Tags },
      { name: "Quotes", href: "/quotes", icon: ReceiptText },
      { name: "Sales Orders", href: "/orders", icon: FileText },
      { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
      { name: "Invoices", href: "/invoices", icon: FileText },
      { name: "Vendors", href: "/vendors", icon: Building2 },
    ],
  },
  {
    name: "Support",
    icon: Folder,
    children: [
      { name: "Cases", href: "/cases", icon: Box },
      { name: "Solutions", href: "/solutions", icon: CheckSquare },
    ],
  },
  {
    name: "Integrations",
    icon: Folder,
    children: [
      { name: "Connections", href: "/connections", icon: Handshake },
      { name: "Marketplace", href: "/marketplace", icon: Box },
    ],
  },
  { name: "Services", href: "/services", icon: Handshake },
  { name: "Projects", href: "/projects", icon: CheckSquare },
  { name: "Voice of the Customer", href: "/voice-of-the-customer", icon: Users },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();
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
          "fixed z-50 flex h-full shrink-0 flex-col overflow-visible bg-[#111827] text-gray-400 shadow-xl transition-all duration-300 ease-in-out md:relative md:translate-x-0",
          effectivelyCollapsed ? "md:w-[80px]" : "w-[240px] md:w-[240px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsCollapsed((current) => !current)}
          className="absolute -right-3 top-6 z-20 hidden rounded-full border border-gray-700 bg-[#111827] p-1 text-white transition-colors hover:bg-gray-800 md:block"
          aria-label={effectivelyCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {effectivelyCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <Link
          href="/"
          onClick={isMobile ? close : undefined}
          className={clsx(
            "flex h-[68px] shrink-0 items-center gap-3 overflow-hidden border-b border-gray-800 px-4",
            effectivelyCollapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Zap size={20} fill="currentColor" />
          </div>
          {!effectivelyCollapsed && (
            <span className="truncate text-lg font-semibold text-white">Saptechno-CRM</span>
          )}
        </Link>

        <nav
          className={clsx(
            "flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            effectivelyCollapsed ? "px-3 py-5" : "px-2 py-3"
          )}
        >
          {effectivelyCollapsed ? (
            <ul className="space-y-3">
              {[...topItems, ...sections].map((item, index) => {
                const IconComponent = item.icon;
                const active = "children" in item ? isActive(item.href) || sectionHasActiveChild(item) : isActive(item.href);

                return (
                  <li key={item.name}>
                    {index === 4 || index === 10 ? <div className="mx-auto mb-4 h-px w-6 bg-gray-700/70" /> : null}
                    <Link
                      href={"href" in item && item.href ? item.href : "#"}
                      title={item.name}
                      onClick={handleLinkClick}
                      className={clsx(
                        "mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
                        active ? "bg-gray-800 text-blue-500" : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                      )}
                    >
                      <IconComponent size={19} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <div className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-gray-500">OVERVIEW</div>

              <ul className="space-y-1">
                {topItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={clsx(
                          "flex h-[34px] items-center gap-3 rounded px-3 py-2 text-[14px] font-medium transition-colors",
                          active ? "bg-gray-800 text-white" : "hover:bg-gray-800/70 hover:text-white",
                          index === 2 && "mb-1"
                        )}
                      >
                        <IconComponent
                          size={17}
                          className={clsx(
                            "shrink-0",
                            item.name === "Home" && "text-[#7793ff]",
                            item.name === "Reports" && "text-[#ec3f84]",
                            item.name === "Analytics" && "text-[#b35cff]",
                            item.name === "My Requests" && "text-[#22d092]"
                          )}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="-mx-2 my-3 border-t border-gray-800" />

              <div className="mb-3 flex items-center gap-2 px-1">
                <div className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded bg-[#8838ff] text-[10px] font-bold text-white">
                  CT
                </div>
                <button className="flex min-w-0 flex-1 items-center gap-1 text-left text-[15px] font-semibold text-white">
                  <span className="truncate">CRM Teamspace</span>
                  <ChevronDown size={15} className="shrink-0 text-gray-400" />
                </button>
                <button className="rounded px-1 py-1 text-gray-400 transition-colors hover:bg-gray-800/70 hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <label className="mb-3 flex items-center gap-2 rounded border border-gray-700 bg-gray-900/40 px-3 py-2 text-gray-500 focus-within:border-gray-500">
                <Search size={16} className="shrink-0" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500"
                  placeholder="Search"
                />
              </label>

              <ul className="space-y-1">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  const open = Boolean(openSections[section.name]);
                  const active = isActive(section.href) || sectionHasActiveChild(section);
                  const hasChildren = Boolean(section.children?.length);
                  const content = (
                    <div className="flex min-w-0 items-center gap-3">
                      <IconComponent
                        size={16}
                        className={clsx("shrink-0", section.name === "Workqueue" ? "text-gray-500" : "text-blue-500")}
                      />
                      <span className="truncate">
                        {section.name}
                        {section.name === "Workqueue" && <span className="ml-1 text-[#dfc72c]">++</span>}
                      </span>
                    </div>
                  );

                  return (
                    <li key={section.name}>
                      {hasChildren ? (
                        <div
                          className={clsx(
                            "flex items-center rounded transition-colors",
                            active ? "bg-gray-800 text-white" : "hover:bg-gray-800/70 hover:text-white"
                          )}
                        >
                          <button
                            onClick={() => toggleSection(section.name)}
                            className="flex min-w-0 flex-1 items-center justify-between px-3 py-2 text-left text-[14px] font-semibold"
                          >
                            {content}
                            {open ? <ChevronUp size={15} className="shrink-0" /> : <ChevronDown size={15} className="shrink-0" />}
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={section.href ?? "#"}
                          onClick={handleLinkClick}
                          className={clsx(
                            "flex items-center justify-between rounded px-3 py-2 text-[14px] font-semibold transition-colors",
                            active ? "bg-gray-800 text-white" : "hover:bg-gray-800/70 hover:text-white"
                          )}
                        >
                          {content}
                        </Link>
                      )}

                      {hasChildren && open && (
                        <ul className="mt-1 space-y-1 pb-1">
                          {section.children?.map((item) => {
                            const ChildIcon = item.icon;
                            const childActive = isActive(item.href);

                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={handleLinkClick}
                                  className={clsx(
                                    "ml-8 flex items-center gap-3 rounded px-3 py-1.5 text-[14px] transition-colors",
                                    childActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                                  )}
                                >
                                  <ChildIcon size={15} className="shrink-0 text-[#94a3bd]" />
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
            "mt-auto flex shrink-0 border-t border-gray-800 p-3",
            effectivelyCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"
          )}
        >
          <div className={clsx("flex min-w-0 items-center", effectivelyCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
              AS
            </div>
            {!effectivelyCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">Atul</div>
                <div className="truncate text-xs text-gray-500">Admin</div>
              </div>
            )}
          </div>
          <button className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};
