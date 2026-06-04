"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Universities",
    href: "/universities",
    icon: GraduationCap,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ShieldAlert,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-[270px] h-screen glass border-r border-white/10 p-6 fixed left-0 top-0">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          UniLink
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Admin Control Center
        </p>
      </div>

      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className="sidebar-link"
            >
              <Icon size={20} />

              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <button className="sidebar-link mt-10 text-red-400">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
