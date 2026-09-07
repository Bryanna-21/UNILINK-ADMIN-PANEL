"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { disconnectSocket } from "@/services/socket";

interface ProfileMenuProps {
  userName: string;
  userRole: string;
  onViewAsClick: () => void;
}

export default function ProfileMenu({ userName, userRole, onViewAsClick }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  function handleLogout() {
    disconnectSocket();
    logout();
    router.push("/login");
  }

  function handleViewAs() {
    setIsOpen(false);
    onViewAsClick();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-surface-raised px-3 py-2 rounded-xl hover:bg-surface-raised/80 transition"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-white">
          {(userName || "A").charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-ink leading-tight">{userName || "Admin"}</p>
          <p className="text-xs text-ink-muted capitalize leading-tight">{userRole || "admin"}</p>
        </div>
        <ChevronDown size={16} className={`text-ink-muted transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-card shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-xs text-ink-muted">Logged in as</p>
            <p className="text-sm font-medium text-ink">{userName}</p>
            <p className="text-xs text-ink-muted capitalize">{userRole}</p>
          </div>

          <nav className="py-2">
            <button
              onClick={() => router.push("/settings")}
              className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-surface-raised transition flex items-center gap-2"
            >
              <span>Settings</span>
            </button>

            <button
              onClick={handleViewAs}
              className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-surface-raised transition flex items-center gap-2"
            >
              <Eye size={16} />
              <span>View As...</span>
            </button>

            <hr className="border-border my-2" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
