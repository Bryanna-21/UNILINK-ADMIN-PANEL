"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import AuditLogCard from "@/components/common/audit-log-card";
import Pagination from "@/components/common/pagination";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useAuditLogs } from "@/hooks/use-audit-logs";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useAuditLogs(page);

  const logs = data?.data ?? [];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Audit Logs</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Every administrative action, recorded automatically. Read-only.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && <ErrorState message="Couldn't load audit logs." onRetry={() => refetch()} />}

        {!isLoading && !error && logs.length === 0 && (
          <EmptyState
            title="No activity yet"
            description="Administrative actions will appear here as they happen."
          />
        )}

        {!isLoading && !error && logs.length > 0 && (
          <>
            <div className="space-y-3">
              {logs.map((log: any) => (
                <AuditLogCard
                  key={log._id}
                  action={log.action}
                  admin={log.adminEmail}
                  target={`${log.targetType}:${log.targetId}`}
                  time={new Date(log.createdAt).toLocaleString()}
                  result={log.result}
                />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
