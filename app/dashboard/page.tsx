
import { OverviewChart } from "./components/Charts/OverviewChart";
import { TrafficChart } from "./components/Charts/TrafficChart";
import { StatCard } from "./components/Charts/StatCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 font-bold text-sm mt-1">
          Welcome back, Atul. Here's a premium overview of your performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$48,295" change="+12.5%" positive />
        <StatCard title="Active Users" value="2,847" change="+8.2%" positive />
        <StatCard title="Orders" value="1,432" change="-3.1%" />
        <StatCard title="Page Views" value="284K" change="+24.7%" positive />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>

        <div className="lg:col-span-1">
          <TrafficChart />
        </div>
      </div>
    </div>
  );
}