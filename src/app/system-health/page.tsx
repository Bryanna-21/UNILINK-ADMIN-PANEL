"use client";

import { RefreshCw } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import SystemHealthCard from "@/components/common/system-health-card";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useSystemHealth } from "@/hooks/use-system-health";

export default function SystemHealthPage() {
  const { data, isLoading, error, refetch, isFetching } = useSystemHealth();
  const health = data?.data;

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">System Health</h1>
            <p className="text-ink-muted mt-2 text-sm">
              Live checks only — nothing here is estimated or simulated.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised text-ink-muted hover:text-ink text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && (
          <ErrorState
            message="Couldn't reach the backend health endpoint — this itself likely means the backend is down."
            onRetry={() => refetch()}
          />
        )}

        {health && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <SystemHealthCard title="Backend" value={health.backend} status={health.backend} />
              <SystemHealthCard title="Database" value={health.database} status={health.database} />
              <SystemHealthCard
                title="Auth service"
                value={health.authService}
                status={health.authService}
              />
            </div>

            <p className="text-ink-muted text-xs mt-6">
              Last checked {new Date(health.checkedAt).toLocaleTimeString()}. Refreshes automatically
              every 30 seconds.
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
