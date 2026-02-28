import {
  BadgePercent,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Image,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";

import type { ComponentType } from "react";
import type { Role } from "@/types";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  roles: Role[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "moderator", "admin"]
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin"]
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
    roles: ["admin"]
  },
  {
    label: "Companies",
    href: "/companies",
    icon: Building2,
    roles: ["admin"]
  },
  {
    label: "Attachments",
    href: "/attachments",
    icon: Image,
    roles: ["admin", "moderator"]
  },
  {
    label: "My Company",
    href: "/companies",
    icon: Building2,
    roles: ["moderator"]
  },
  {
    label: "Discounts",
    href: "/discounts",
    icon: BadgePercent,
    roles: ["moderator", "admin"]
  },
  {
    label: "My Discounts",
    href: "/discounts",
    icon: BadgePercent,
    roles: ["student"]
  },
  {
    label: "Student Applications",
    href: "/applications",
    icon: ClipboardCheck,
    roles: ["admin"]
  },
  {
    label: "My Applications",
    href: "/applications/my",
    icon: ClipboardCheck,
    roles: ["student"]
  },
  {
    label: "Apply for Verification",
    href: "/applications/apply",
    icon: GraduationCap,
    roles: ["student"]
  },
  {
    label: "Supported Domains",
    href: "/domains",
    icon: ShieldCheck,
    roles: ["admin"]
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["student", "moderator", "admin"]
  }
];
