"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard, Users, ShieldAlert, GraduationCap, BarChart3,
  Settings, Bell, LogOut, Activity, FileText,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Students", href: "/students", icon: GraduationCap },
  { name: "Universities", href: "/universities", icon: GraduationCap },
  { name: "Reports", href: "/reports", icon: ShieldAlert },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Audit Logs", href: "/audit-logs", icon: FileText },
  { name: "System Health", href: "/system-health", icon: Activity },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className={`${mobile ? "w-full h-full" : "desktop-sidebar fixed left-0 top-0 z-40 w-[264px] h-screen"} bg-[#0b1730] text-white flex flex-col border-r border-white/10`}>
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold shadow-lg shadow-blue-950/30">U</div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">UniLink</div>
            <div className="text-[11px] uppercase tracking-[.18em] text-slate-400">Admin Console</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Management</div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-300 hover:bg-red-500/10 hover:text-red-200">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
