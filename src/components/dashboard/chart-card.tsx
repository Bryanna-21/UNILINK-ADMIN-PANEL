"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    month: "Jan",
    users: 200,
  },

  {
    month: "Feb",
    users: 600,
  },

  {
    month: "Mar",
    users: 1200,
  },

  {
    month: "Apr",
    users: 2400,
  },

  {
    month: "May",
    users: 3900,
  },

  {
    month: "Jun",
    users: 5200,
  },
];

export default function ChartCard() {
  return (
    <div className="card h-[400px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Platform Growth
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Monthly user analytics
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#7c3aed"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
