"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import ThemeToggle from "@/components/common/theme-toggle";
import ProfileMenu from "@/components/common/profile-menu";
import ViewAsModal from "@/components/common/view-as-modal";
import { useAuthStore } from "@/store/auth.store";
import { useNotifications } from "@/hooks/use-notifications";

export default function Topbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const viewAs = useAuthStore((state) => state.viewAs);
  const { data } = useNotifications();
  const unreadCount = data?.unreadCount ?? 0;
  const [viewAsModalOpen, setViewAsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-surface border border-border h-[72px] rounded-card px-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-muted">Welcome back</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ink">{user?.name || "Administrator"}</p>
            {viewAs && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                Viewing as {viewAs.asRole}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => router.push("/notifications")}
            className="relative bg-surface-raised p-3 rounded-xl text-ink-muted hover:text-ink transition"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <ProfileMenu
            userName={user?.name || "Administrator"}
            userRole={user?.role || "admin"}
            onViewAsClick={() => setViewAsModalOpen(true)}
          />
        </div>
      </header>

      <ViewAsModal isOpen={viewAsModalOpen} onClose={() => setViewAsModalOpen(false)} />
    </>
  );
}
