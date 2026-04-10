import { LucideIcon } from "lucide-react";

export type MenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export type MenuGroup = {
  title: string;
  items: MenuItem[];
};
