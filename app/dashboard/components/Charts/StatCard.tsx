import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({ title, value, change, positive }: any) => {
  return (
    <div 
      style={{ padding: 'var(--card-p)' }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-gray-500 dark:text-slate-400 capitalize tracking-tight">{title}</div>
        <div className={`p-2 rounded-xl ${positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400"}`}>
          {positive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-950 dark:text-white tracking-tight">{value}</div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-sm font-bold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {change}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">vs last month</span>
        </div>
      </div>
    </div>
  );
};