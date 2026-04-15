import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({ title, value, change, positive }: any) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <div className="text-sm text-gray-500">{title}</div>

      <div className="text-2xl font-bold mt-2">{value}</div>

      <div
        className={`flex items-center gap-1 text-sm mt-2 ${
          positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
  );
};