"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import StudentsTable from "@/components/students/students-table";

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Student Management
          </h1>

          <p className="text-gray-400 mt-2">
            Monitor and manage
            all student accounts.
          </p>
        </div>

        <StudentsTable />
      </div>
    </DashboardLayout>
  );
}
