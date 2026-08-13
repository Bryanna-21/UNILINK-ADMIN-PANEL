"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import UsersTable from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">User Management</h1>
          <p className="text-ink-muted mt-2 text-sm">Manage all platform users and roles.</p>
        </div>

        <UsersTable />
      </div>
    </DashboardLayout>
  );
}
