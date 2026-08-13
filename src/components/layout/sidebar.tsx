"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldAlert,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  FileClock,
  HeartPulse,
  UserCog,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { disconnectSocket } from "@/services/socket";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: GraduationCap },
  { name: "Users", href: "/users", icon: UserCog },
  { name: "Universities", href: "/universities", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: ShieldAlert },
  { name: "Audit Logs", href: "/audit-logs", icon: FileClock },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "System Health", href: "/system-health", icon: HeartPulse },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    disconnectSocket();
    logout();
    router.push("/login");
  }

  return (
    <aside className="w-[260px] h-screen bg-surface border-r border-border p-5 flex flex-col">
      <div className="mb-8 px-1">
        <h1 className="text-2xl font-display font-semibold text-ink">UniLink</h1>
        <p className="text-xs text-ink-muted mt-1">Admin Control Center</p>
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
            >
              <Icon size={18} />
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className="sidebar-link mt-4 text-danger">
        <LogOut size={18} />
        <span className="text-sm">Log out</span>
      </button>
    </aside>
  );
}
