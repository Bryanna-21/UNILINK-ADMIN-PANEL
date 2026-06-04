import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back, Administrator.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="12,430"
            growth="+12.4%"
          />

          <StatsCard
            title="Reports"
            value="42"
            growth="+4.3%"
          />

          <StatsCard
            title="Universities"
            value="31"
            growth="+2.1%"
          />

          <StatsCard
            title="Revenue"
            value="$8,900"
            growth="+15.2%"
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="card col-span-2 h-[400px]">
            <h2 className="text-2xl font-bold mb-4">
              Platform Analytics
            </h2>
          </div>

          <div className="card h-[400px]">
            <h2 className="text-2xl font-bold mb-4">
              Recent Activity
            </h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
