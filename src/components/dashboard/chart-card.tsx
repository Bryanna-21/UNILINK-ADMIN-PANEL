"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis } from "recharts";

const data = [
  { month: "Jan", users: 2000 }, { month: "Feb", users: 3600 }, { month: "Mar", users: 5200 },
  { month: "Apr", users: 7100 }, { month: "May", users: 9300 }, { month: "Jun", users: 12430 },
];

export default function ChartCard() {
  return (
    <div className="card h-[390px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Platform growth</h2>
          <p className="text-sm text-slate-500 mt-1">Registered users over the last six months</p>
        </div>
        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">6 months</span>
      </div>
      <div className="h-[285px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,.08)" }} />
            <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
