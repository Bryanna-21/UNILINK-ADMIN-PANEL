"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import ReportCard from "@/components/reports/report-card";

const reports = [
  {
    id: "1",

    reason: "Spam content",

    reportedBy: "Sarah",

    status: "Pending",
  },

  {
    id: "2",

    reason: "Harassment",

    reportedBy: "Mike",

    status: "Pending",
  },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Reports Moderation
          </h1>

          <p className="text-gray-400 mt-2">
            Review flagged content.
          </p>
        </div>

        <div className="space-y-5">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onResolve={() =>
                console.log(
                  "Resolve",
                  report.id
                )
              }
              onDelete={() =>
                console.log(
                  "Delete",
                  report.id
                )
              }
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
