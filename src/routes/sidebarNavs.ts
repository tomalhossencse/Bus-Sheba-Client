import {
  Bus,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  MapIcon,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavs: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Operators", href: "/dashboard/admin/operators", icon: Users },
  { label: "Routes", href: "/dashboard/admin/routes", icon: MapIcon },
  { label: "Buses", href: "/dashboard/admin/buses", icon: Bus },
  { label: "Trips", href: "/dashboard/admin/trips", icon: Calendar },
  { label: "Bookings", href: "/dashboard/admin/bookings", icon: Ticket },
];

export const operatorNavs: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/operator", icon: LayoutDashboard },
  { label: "My Buses", href: "/dashboard/operator/buses", icon: Bus },
  { label: "My Trips", href: "/dashboard/operator/trips", icon: Calendar },
  {
    label: "Bookings",
    href: "/dashboard/operator/bookings",
    icon: ClipboardList,
  },
  {
    label: "Scan Ticket",
    href: "/dashboard/operator/tickets/scan",
    icon: Ticket,
  },
  { label: "Analytics", href: "/dashboard/operator/analytics", icon: Wallet },
];

export const passengerNavs: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/passenger", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/passenger/bookings", icon: Ticket },
  { label: "My Tickets", href: "/dashboard/passenger/tickets", icon: Ticket },
  { label: "Payments", href: "/dashboard/passenger/payments", icon: Wallet },
];

export const navsByRole: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: adminNavs,
  ADMIN: adminNavs,
  OPERATOR: operatorNavs,
  PASSENGER: passengerNavs,
};
