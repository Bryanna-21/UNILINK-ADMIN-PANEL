"use client";

import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ThemeToggle from "@/components/common/theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import { disconnectSocket } from "@/services/socket";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    disconnectSocket();
    logout();
    router.push("/login");
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Settings</h1>
          <p className="text-ink-muted mt-2 text-sm">Manage your admin account and preferences.</p>
        </div>

        <div className="max-w-[600px] space-y-6">
          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">Profile</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Name</span>
                <span className="text-ink">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Email</span>
                <span className="text-ink">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Role</span>
                <span className="text-ink capitalize">{user?.role}</span>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">Theme</span>
              <ThemeToggle />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">Security</h2>
            <p className="text-ink-muted text-sm mb-4">
              Password changes and active-session management aren&apos;t available yet — the
              backend doesn&apos;t currently expose those endpoints. See project notes for what
              would be needed to add them.
            </p>
            <button onClick={handleLogout} className="btn-primary text-sm">
              Log out of this session
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
