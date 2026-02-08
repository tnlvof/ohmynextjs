'use client';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
          {stat.change && <p className="text-sm text-green-500 mt-1">{stat.change}</p>}
        </div>
      ))}
    </div>
  );
}
