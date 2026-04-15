
import { OverviewChart } from "./components/Charts/OverviewChart";
import { TrafficChart } from "./components/Charts/TrafficChart";
import { StatCard } from "./components/Charts/StatCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, Atul. Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$48,295" change="+12.5%" positive />
        <StatCard title="Active Users" value="2,847" change="+8.2%" positive />
        <StatCard title="Orders" value="1,432" change="-3.1%" />
        <StatCard title="Page Views" value="284K" change="+24.7%" positive />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <OverviewChart />
        </div>

        <TrafficChart />
      </div>
    </div>
  );
}