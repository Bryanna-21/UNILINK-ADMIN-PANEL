import { CheckCircle2, ShieldAlert, University, Users } from "lucide-react";

const activities = [
  { id: 1, title: "New university verified", time: "2 mins ago", icon: University, tone: "text-blue-600 bg-blue-50" },
  { id: 2, title: "Admin resolved a report", time: "10 mins ago", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  { id: 3, title: "Content flagged for review", time: "24 mins ago", icon: ShieldAlert, tone: "text-amber-600 bg-amber-50" },
  { id: 4, title: "500 new users joined", time: "1 hour ago", icon: Users, tone: "text-slate-600 bg-slate-100" },
];

export default function ActivityCard() {
  return (
    <div className="card h-[390px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
          <p className="text-sm text-slate-500 mt-1">Latest platform events</p>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all</button>
      </div>
      <div className="space-y-2">
        {activities.map(({ id, title, time, icon: Icon, tone }) => (
          <div key={id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tone}`}><Icon size={17} /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
