import DashboardLayout from "@/components/layout/dashboard-layout";

import UsersTable from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            User Management
          </h1>

          <p className="text-gray-400 mt-2">
            Manage platform users.
          </p>
        </div>

        <UsersTable />
      </div>
    </DashboardLayout>
  );
}
