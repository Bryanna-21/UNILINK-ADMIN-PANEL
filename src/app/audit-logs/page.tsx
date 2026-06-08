"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import AuditLogCard from "@/components/common/audit-log-card";

const logs = [
  {
    id: 1,

    action:
      "Suspended user account",

    admin: "Admin",

    time: "2 mins ago",
  },

  {
    id: 2,

    action:
      "Verified university",

    admin: "Moderator",

    time: "10 mins ago",
  },
];

export default function AuditLogsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Audit Logs
          </h1>

          <p className="text-gray-400 mt-2">
            Administrative activity
            tracking.
          </p>
        </div>

        <div className="space-y-5">
          {logs.map((log) => (
            <AuditLogCard
              key={log.id}
              action={log.action}
              admin={log.admin}
              time={log.time}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
