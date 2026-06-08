"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import { useNotificationStore } from "@/store/notification.store";

export default function NotificationsPage() {
  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications
    );

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-400 mt-2">
            Real-time platform alerts.
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map(
            (notification) => (
              <div
                key={notification.id}
                className="card"
              >
                {
                  notification.message
                }
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
