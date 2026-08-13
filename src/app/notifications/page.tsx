"use client";

import { Bell } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useNotifications, useMarkNotificationRead } from "@/hooks/use-notifications";

export default function NotificationsPage() {
  const { data, isLoading, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();

  const notifications = data?.data ?? [];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Notifications</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Admin-relevant events. Live-pushed while you're viewing the panel, and always
            available here on load.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && <ErrorState message="Couldn't load notifications." onRetry={() => refetch()} />}

        {!isLoading && !error && notifications.length === 0 && (
          <EmptyState
            title="You're all caught up"
            description="No notifications yet. New emergency reports will appear here."
          />
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n: any) => (
              <button
                key={n._id}
                onClick={() => !n.read && markRead.mutate(n._id)}
                className="card p-5 w-full text-left status-edge"
                data-status={n.read ? undefined : "open"}
              >
                <div className="flex items-start gap-3">
                  <Bell size={16} className="text-ink-muted mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-ink font-medium text-sm">{n.title}</p>
                    {n.message && <p className="text-ink-muted text-sm mt-1">{n.message}</p>}
                    <p className="text-ink-muted text-xs mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent-bright mt-1.5 shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
