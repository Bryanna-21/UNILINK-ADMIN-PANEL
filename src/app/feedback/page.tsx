"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import FeedbackCard from "@/components/feedback/feedback-card";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import Pagination from "@/components/common/pagination";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useFeedback, useSetFeedbackStatus } from "@/hooks/use-feedback";
import { STATUS_TABS, tabCount, type FeedbackFilter } from "@/lib/feedback-view";

export default function ProblemReportsPage() {
  const [status, setStatus] = useState<FeedbackFilter>("new");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading, error, refetch, isFetching } = useFeedback(status, page);
  const mutation = useSetFeedbackStatus();

  const items = data?.items ?? [];
  const counts = data?.counts ?? { new: 0, seen: 0, closed: 0 };

  const changeTab = (value: FeedbackFilter) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-display font-semibold text-ink">Problem Reports</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Problems and ideas sent by students and lecturers from the app and the website. The list refreshes by itself.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter by status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => changeTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                status === tab.value ? "bg-accent text-white" : "bg-surface-raised text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label} ({tabCount(tab.value, counts)})
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && !data && <ErrorState message="Couldn't load problem reports." onRetry={() => refetch()} />}

        {!isLoading && !error && items.length === 0 && (
          <EmptyState title="No reports" description="Nothing here for this filter. New reports appear on their own." />
        )}

        {items.length > 0 && (
          <div className={`space-y-4 ${isFetching ? "opacity-80" : ""}`}>
            {items.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                error={errors[item.id]}
                onSetStatus={(next) => {
                  setBusyId(item.id);
                  setErrors((e) => ({ ...e, [item.id]: "" }));
                  mutation.mutate(
                    { id: item.id, status: next },
                    {
                      onError: (err: any) =>
                        setErrors((e) => ({ ...e, [item.id]: err?.response?.data?.message || "Could not update this report. Please try again." })),
                      onSettled: () => setBusyId(null),
                    }
                  );
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          <Pagination currentPage={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        </div>
      </div>
    </DashboardLayout>
  );
}
