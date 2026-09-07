"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldAlert,
  BarChart3,
  Bell,
  Settings,
  FileClock,
  HeartPulse,
  UserCog,
  BookOpen,
  Building2,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ size: number }>;
  roles?: ("admin" | "superadmin")[];
  beta?: boolean;
}

const adminLinks: NavLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: GraduationCap },
  { name: "Users", href: "/users", icon: UserCog },
  { name: "Universities", href: "/universities", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: ShieldAlert },
  { name: "Audit Logs", href: "/audit-logs", icon: FileClock },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "System Health", href: "/system-health", icon: HeartPulse },
];

const superadminLinks: NavLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Admin Management", href: "/admins", icon: UserCog, beta: true },
  { name: "Units", href: "/units", icon: BookOpen, beta: true },
  { name: "Universities", href: "/universities", icon: Building2 },
  { name: "Students", href: "/students", icon: GraduationCap },
  { name: "Users", href: "/users", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: ShieldAlert },
  { name: "Audit Logs", href: "/audit-logs", icon: FileClock },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "System Health", href: "/system-health", icon: HeartPulse },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const links = user?.role === "superadmin" ? superadminLinks : adminLinks;

  return (
    <aside className="w-[260px] h-screen bg-surface border-r border-border p-5 flex flex-col">
      <div className="mb-8 px-1">
        <h1 className="text-2xl font-display font-semibold text-ink">UniLink</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-ink-muted">Admin Control Center</p>
          {user?.role === "superadmin" && (
            <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-semibold">
              SUPER
            </span>
          )}
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");

          return (
            <Link
              key={link.name}
              href={link.href}
              className="sidebar-link"
              data-active={isActive}
              title={link.beta ? "New feature" : ""}
            >
              <Icon size={18} />
              <span className="text-sm">{link.name}</span>
              {link.beta && <span className="text-[10px] bg-accent/20 text-accent px-1 rounded ml-auto">NEW</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
