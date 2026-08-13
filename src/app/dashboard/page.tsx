"use client";

import Link from "next/link";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import ErrorState from "@/components/common/error-state";
import EmptyState from "@/components/common/empty-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useDashboardStats, useRecentUsers } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const stats = useDashboardStats();
  const recent = useRecentUsers();

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Dashboard</h1>
          <p className="text-ink-muted mt-2 text-sm">Welcome back, {user?.name?.split(" ")[0] || "Administrator"}.</p>
        </div>

        {stats.isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {stats.error && (
          <ErrorState message="Couldn't load dashboard stats." onRetry={() => stats.refetch()} />
        )}

        {stats.data?.data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCard title="Total Students" value={stats.data.data.totalStudents} />
            <StatsCard title="Total Universities" value={stats.data.data.totalUniversities} />
            <StatsCard title="Total Users" value={stats.data.data.totalUsers} />
            <StatsCard title="Open Reports" value={stats.data.data.openReports} />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-ink">Recent registrations</h2>
              <Link href="/users" className="text-xs text-accent-bright hover:underline">
                View all
              </Link>
            </div>

            {recent.isLoading && <SkeletonCard />}
            {recent.error && (
              <ErrorState message="Couldn't load recent activity." onRetry={() => recent.refetch()} />
            )}
            {recent.data?.data?.length === 0 && (
              <EmptyState title="No registrations yet" description="New users will show up here." />
            )}
            {recent.data?.data?.length > 0 && (
              <div className="space-y-3">
                {recent.data.data.map((u: any) => (
                  <div key={u._id} className="flex items-center justify-between text-sm py-2 border-b border-border/60 last:border-0">
                    <div>
                      <p className="text-ink">{u.name}</p>
                      <p className="text-ink-muted text-xs capitalize">{u.role}</p>
                    </div>
                    <p className="text-ink-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">Quick links</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Review reports", href: "/reports" },
                { label: "Verify universities", href: "/universities" },
                { label: "View analytics", href: "/analytics" },
                { label: "System health", href: "/system-health" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-4 rounded-lg bg-surface-raised text-sm text-ink hover:bg-accent/10 hover:text-accent-bright transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
