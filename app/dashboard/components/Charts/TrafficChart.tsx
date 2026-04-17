"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Referral", value: 22 },
  { name: "Social", value: 15 },
];

const COLORS = ["#3B82F6", "#10B981", "#6366F1", "#A855F7"];

export const TrafficChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div>
        <h3 className="text-lg font-bold text-gray-950 dark:text-white">Traffic Sources</h3>
        <p className="text-xs font-bold text-gray-500 dark:text-slate-500 mt-0.5">Where your users come from</p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              innerRadius={65} 
              outerRadius={85} 
              paddingAngle={5} 
              stroke="none"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} className="focus:outline-none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f172a", 
                border: "none", 
                borderRadius: "12px",
                color: "#f8fafc",
                fontWeight: "600"
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-950 dark:text-white">{item.name}</span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};