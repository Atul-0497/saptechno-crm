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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">Revenue Overview</h3>
          <p className="text-xs font-bold text-gray-500 dark:text-slate-500 mt-0.5">Monthly revenue growth trends</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            Revenue
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
            dy={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              border: "none", 
              borderRadius: "12px",
              color: "#f8fafc",
              fontWeight: "600"
            }}
            itemStyle={{ color: "#3b82f6" }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={4} 
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};