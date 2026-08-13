"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StudentsTable from "@/components/students/students-table";

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Student Management</h1>
          <p className="text-ink-muted mt-2 text-sm">Monitor and manage all student accounts.</p>
        </div>

        <StudentsTable />
      </div>
    </DashboardLayout>
  );
}
