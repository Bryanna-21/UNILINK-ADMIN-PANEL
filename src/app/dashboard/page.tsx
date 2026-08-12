import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import ChartCard from "@/components/dashboard/chart-card";
import ActivityCard from "@/components/dashboard/activity-card";
import { ShieldCheck, AlertTriangle, Users, Building2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-7">
        <section className="rounded-2xl bg-[#0b1730] p-6 sm:p-7 text-white shadow-xl shadow-slate-900/10 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> System operational
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-4">Good afternoon, Administrator.</h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2">Here is the current operational picture across UniLink.</p>
          </div>
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-8 bottom-6 hidden md:flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
            <ShieldCheck className="text-emerald-400" size={20} />
            <div><p className="text-xs text-slate-400">Security status</p><p className="text-sm font-bold">Healthy</p></div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total users" value="12,430" growth="+12.4%" hint="vs last month" />
          <StatsCard title="Universities" value="31" growth="+2.1%" hint="active institutions" />
          <StatsCard title="Open reports" value="42" growth="-8.3%" hint="vs last week" />
          <StatsCard title="Active students" value="10,982" growth="+9.7%" hint="this month" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2"><ChartCard /></div>
          <ActivityCard />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickStatus icon={Users} title="User management" value="12,430" label="accounts" />
          <QuickStatus icon={Building2} title="Institutions" value="31" label="universities" />
          <QuickStatus icon={AlertTriangle} title="Needs attention" value="42" label="open reports" warning />
        </section>
      </div>
    </DashboardLayout>
  );
}

function QuickStatus({ icon: Icon, title, value, label, warning = false }: { icon: typeof Users; title: string; value: string; label: string; warning?: boolean }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${warning ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
        <Icon size={20} />
      </div>
      <div><p className="text-xs font-medium text-slate-500">{title}</p><p className="text-xl font-extrabold text-slate-900">{value} <span className="text-xs font-medium text-slate-400">{label}</span></p></div>
    </div>
  );
}
