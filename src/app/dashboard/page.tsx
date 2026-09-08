"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  User,
  Building2,
  BookOpen,
  Award,
  Zap,
  Activity,
} from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import ErrorState from "@/components/common/error-state";
import EmptyState from "@/components/common/empty-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useDashboardStats, useRecentUsers } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

interface ExtendedStats {
  overview?: {
    totalStudents?: number;
    totalLecturers?: number;
    totalAdmins?: number;
    totalUniversities?: number;
    totalUnits?: number;
    activeCourses?: number;
    totalExams?: number;
  };
  recentActivity?: {
    auditLogs?: Array<{
      id: string;
      action: string;
      admin: string;
      targetType: string;
      result: string;
      timestamp: string;
    }>;
  };
  systemHealth?: {
    status?: string;
    database?: string;
    uptime?: number;
  };
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-accent/10 text-accent">
        {icon}
      </div>

      <div>
        <p className="text-ink-muted text-sm">{title}</p>
        <p className="text-ink text-2xl font-semibold">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const stats = useDashboardStats();
  const recent = useRecentUsers();

  const [extended, setExtended] = useState<ExtendedStats | null>(null);
  const [extendedLoading, setExtendedLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadExtendedStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");

        if (mounted) {
          setExtended(response.data?.data || null);
        }
      } catch {
        // The existing dashboard hooks remain the primary source.
      } finally {
        if (mounted) {
          setExtendedLoading(false);
        }
      }
    };

    loadExtendedStats();

    const interval = setInterval(loadExtendedStats, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const overview = extended?.overview;

  const totalStudents =
    overview?.totalStudents ??
    stats.data?.data?.totalStudents ??
    0;

  const totalUniversities =
    overview?.totalUniversities ??
    stats.data?.data?.totalUniversities ??
    0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">
            Dashboard
          </h1>

          <p className="text-ink-muted mt-2 text-sm">
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "Administrator"}.
          </p>
        </div>

        {/* Existing Core Stats */}
        {stats.isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {stats.error && (
          <ErrorState
            message="Couldn't load dashboard stats."
            onRetry={() => stats.refetch()}
          />
        )}

        {stats.data?.data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCard
              title="Total Students"
              value={totalStudents}
            />

            <StatsCard
              title="Total Universities"
              value={totalUniversities}
            />

            <StatsCard
              title="Total Users"
              value={stats.data.data.totalUsers}
            />

            <StatsCard
              title="Open Reports"
              value={stats.data.data.openReports}
            />
          </div>
        )}

        {/* Extended Platform Metrics */}
        {extendedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-accent" />
              <h2 className="font-display font-semibold text-ink">
                Platform Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard
                icon={<User size={22} />}
                title="Lecturers"
                value={overview?.totalLecturers ?? 0}
              />

              <MetricCard
                icon={<Users size={22} />}
                title="Admins"
                value={overview?.totalAdmins ?? 0}
              />

              <MetricCard
                icon={<BookOpen size={22} />}
                title="Units"
                value={overview?.totalUnits ?? 0}
              />

              <MetricCard
                icon={<Award size={22} />}
                title="Active Courses"
                value={overview?.activeCourses ?? 0}
              />

              <MetricCard
                icon={<Building2 size={22} />}
                title="Universities"
                value={totalUniversities}
              />

              <MetricCard
                icon={<Zap size={22} />}
                title="Exams"
                value={overview?.totalExams ?? 0}
              />
            </div>
          </div>
        )}

        {/* Activity + System */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-ink">
                Recent Activity
              </h2>

              <Link
                href="/audit-logs"
                className="text-xs text-accent-bright hover:underline"
              >
                View all
              </Link>
            </div>

            {!extended?.recentActivity?.auditLogs?.length ? (
              <EmptyState
                title="No recent activity"
                description="Administrative activity will appear here."
              />
            ) : (
              <div className="space-y-3">
                {extended.recentActivity.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0"
                  >
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Zap size={16} className="text-accent" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {log.action.replace(/_/g, " ").toLowerCase()}
                      </p>

                      <p className="text-xs text-ink-muted">
                        By {log.admin} on {log.targetType}
                      </p>

                      <p className="text-xs text-ink-muted mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        log.result === "success"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {log.result}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">
              System Status
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-muted">
                  Platform
                </span>

                <span className="flex items-center gap-2 text-sm font-medium text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {extended?.systemHealth?.status || "Operational"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-ink-muted">
                  Database
                </span>

                <span className="text-sm font-medium text-green-500">
                  {extended?.systemHealth?.database || "Connected"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-ink-muted">
                  Uptime
                </span>

                <span className="text-sm font-medium text-ink">
                  {extended?.systemHealth?.uptime
                    ? `${Math.floor(
                        extended.systemHealth.uptime / 60
                      )}m`
                    : "—"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Registrations + Quick Links */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-ink">
                Recent registrations
              </h2>

              <Link
                href="/users"
                className="text-xs text-accent-bright hover:underline"
              >
                View all
              </Link>
            </div>

            {recent.isLoading && <SkeletonCard />}

            {recent.error && (
              <ErrorState
                message="Couldn't load recent activity."
                onRetry={() => recent.refetch()}
              />
            )}

            {recent.data?.data?.length === 0 && (
              <EmptyState
                title="No registrations yet"
                description="New users will show up here."
              />
            )}

            {recent.data?.data?.length > 0 && (
              <div className="space-y-3">
                {recent.data.data.map((u: any) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between text-sm py-2 border-b border-border/60 last:border-0"
                  >
                    <div>
                      <p className="text-ink">{u.name}</p>
                      <p className="text-ink-muted text-xs capitalize">
                        {u.role}
                      </p>
                    </div>

                    <p className="text-ink-muted text-xs">
                      {new Date(
                        u.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-4">
              Quick links
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Manage lecturers",
                  href: "/lecturers",
                },
                {
                  label: "Review reports",
                  href: "/reports",
                },
                {
                  label: "Verify universities",
                  href: "/universities",
                },
                {
                  label: "View analytics",
                  href: "/analytics",
                },
                {
                  label: "System health",
                  href: "/system-health",
                },
                {
                  label: "Audit logs",
                  href: "/audit-logs",
                },
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
