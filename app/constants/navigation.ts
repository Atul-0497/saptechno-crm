import {
  Activity,
  BarChart3,
  Box,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckSquare,
  CircleDot,
  ClipboardList,
  Database,
  Factory,
  FileBox,
  FileText,
  Globe,
  MapPin,
  Handshake,
  Home,
  LifeBuoy,
  Megaphone,
  Package,
  ReceiptText,
  ShoppingCart,
  Tags,
  UserCircle,
  Users,
  WalletCards,
  Blocks,
  type LucideIcon
} from "lucide-react";

export type NavIcon = LucideIcon;

export interface NavItem {
  name: string;
  href: string;
  icon: NavIcon;
}

export interface NavSection {
  name: string;
  icon: NavIcon;
  href?: string;
  defaultOpen?: boolean;
  actions?: boolean;
  children?: NavItem[];
}

export const TOP_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "My Requests", href: "/requests", icon: BriefcaseBusiness },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    name: "Companies",
    icon: Building2,
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
    icon: Database,
    defaultOpen: true,
    actions: true,
    children: [
      { name: "Company", href: "/CompanyMaster", icon: Building2 },
      { name: "Department", href: "/DepartmentMaster", icon: Building2 },
      { name: "Designation", href: "/DesignationMaster", icon: BriefcaseBusiness },
      { name: "Employee", href: "/EmployeesMaster", icon: Users },
      { name: "Vendor", href: "/VendorMaster", icon: Building2 },
      { name: "Product", href: "/Productmaster", icon: Package },
      { name: "Quotes", href: "/QuotesMaster", icon: ReceiptText },
      { name: "Purchase Orders", href: "/PurchaseorderMaster", icon: ShoppingCart },
      { name: "Dealer", href: "/DealerMaster", icon: Handshake },
      { name: "Lead Source", href: "/LeadSourcemaster", icon: Megaphone },
      { name: "Industry", href: "/IndustryMaster", icon: Factory },
      { name: "Country", href: "/Location/Country", icon: Globe },
      { name: "State", href: "/Location/State", icon: Globe },
      { name: "City", href: "/Location/City", icon: Globe },
      { name: "Pin Code", href: "/Location/Pincode", icon: MapPin },
    ],
  },
  {
    name: "Sales",
    icon: Handshake,
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
    icon: CalendarDays,
    children: [
      { name: "Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Meetings", href: "/meetings", icon: CalendarDays },
      { name: "Calls", href: "/calls", icon: Activity },
    ],
  },
  {
    name: "Inventory",
    icon: Package,
    children: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Price Books", href: "/price-books", icon: Tags },
      { name: "Sales Orders", href: "/orders", icon: FileText },
      { name: "Invoices", href: "/invoices", icon: FileText },
      { name: "Vendors", href: "/vendors", icon: Building2 },
    ],
  },
  {
    name: "Support",
    icon: LifeBuoy,
    children: [
      { name: "Cases", href: "/cases", icon: Box },
      { name: "Solutions", href: "/solutions", icon: CheckSquare },
    ],
  },
  {
    name: "Integrations",
    icon: Blocks,
    children: [
      { name: "Connections", href: "/connections", icon: Handshake },
      { name: "Marketplace", href: "/marketplace", icon: Box },
    ],
  },
  { name: "Services", href: "/services", icon: Handshake },
  { name: "Projects", href: "/projects", icon: CheckSquare },
  { name: "Voice of the Customer", href: "/voice-of-the-customer", icon: Users },
];
