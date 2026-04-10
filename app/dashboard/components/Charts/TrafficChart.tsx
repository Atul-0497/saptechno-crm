"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Referral", value: 22 },
  { name: "Social", value: 15 },
];

const COLORS = ["#3B82F6", "#10B981", "#6366F1", "#A855F7"];

export const TrafficChart = () => {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <h3 className="font-semibold mb-4">Traffic Sources</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};