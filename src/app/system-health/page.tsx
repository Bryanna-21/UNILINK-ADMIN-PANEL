"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import SystemHealthCard from "@/components/common/system-health-card";

const metrics = [
  {
    title: "API Uptime",

    value: "99.98%",

    status: "Healthy",
  },

  {
    title: "Database",

    value: "Operational",

    status: "Healthy",
  },

  {
    title: "Socket Server",

    value: "Stable",

    status: "Healthy",
  },

  {
    title: "Storage",

    value: "78%",

    status: "Warning",
  },
];

export default function SystemHealthPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            System Health
          </h1>

          <p className="text-gray-400 mt-2">
            Infrastructure monitoring.
          </p>
        </div>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
        >
          {metrics.map(
            (metric) => (
              <SystemHealthCard
                key={metric.title}
                title={
                  metric.title
                }
                value={
                  metric.value
                }
                status={
                  metric.status
                }
              />
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
