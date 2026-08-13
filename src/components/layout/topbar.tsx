"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import ThemeToggle from "@/components/common/theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import { useNotifications } from "@/hooks/use-notifications";

export default function Topbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data } = useNotifications();
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <header className="bg-surface border border-border h-[72px] rounded-card px-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-ink-muted">Welcome back</p>
        <p className="text-sm font-medium text-ink">{user?.name || "Administrator"}</p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={() => router.push("/notifications")}
          className="relative bg-surface-raised p-3 rounded-xl text-ink-muted hover:text-ink"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 bg-surface-raised px-3 py-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-white">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-ink leading-tight">{user?.name || "Admin"}</p>
            <p className="text-xs text-ink-muted capitalize leading-tight">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
