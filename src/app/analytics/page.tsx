import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-gray-400 mt-2">
            Platform performance and usage metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard title="Students" value="—" growth="Awaiting API data" />
          <StatsCard title="Universities" value="—" growth="Awaiting API data" />
          <StatsCard title="Active Users" value="—" growth="Awaiting API data" />
          <StatsCard title="Reports" value="—" growth="Awaiting API data" />
        </div>
      </div>
    </DashboardLayout>
  );
}
