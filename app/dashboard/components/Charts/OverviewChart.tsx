"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 15000 },
  { name: "Feb", value: 22000 },
  { name: "Mar", value: 18000 },
  { name: "Apr", value: 30000 },
  { name: "May", value: 28000 },
  { name: "Jun", value: 35000 },
];

export const OverviewChart = () => {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <h3 className="font-semibold mb-4">Overview</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};