interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  positive?: boolean;
}

export const StatCard = ({ title, value, change, positive }: StatCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {change}
        </span>
      </div>
    </div>
  );
};
