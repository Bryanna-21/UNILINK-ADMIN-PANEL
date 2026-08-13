"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ReportCard from "@/components/reports/report-card";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useReports, useSetReportStatus } from "@/hooks/use-reports";

const statusTabs: { label: string; value: "open" | "resolved" | "dismissed" | undefined }[] = [
  { label: "Open", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
  { label: "All", value: undefined },
];

export default function ReportsPage() {
  const [status, setStatus] = useState<"open" | "resolved" | "dismissed" | undefined>("open");
  const { data, isLoading, error, refetch } = useReports(status);
  const statusMutation = useSetReportStatus();

  const reports = data?.data ?? [];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-display font-semibold text-ink">Emergency Reports</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Safety, medical, and abuse reports filed by students.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatus(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                status === tab.value ? "bg-accent text-white" : "bg-surface-raised text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && <ErrorState message="Couldn't load reports." onRetry={() => refetch()} />}

        {!isLoading && !error && reports.length === 0 && (
          <EmptyState title="No reports" description="No reports match this filter." />
        )}

        {!isLoading && !error && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report: any) => (
              <ReportCard
                key={report._id}
                report={report}
                isPending={statusMutation.isPending}
                onSetStatus={(newStatus) =>
                  statusMutation.mutate({ reportId: report._id, status: newStatus })
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
