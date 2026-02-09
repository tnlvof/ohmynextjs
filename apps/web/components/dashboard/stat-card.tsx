interface StatCardProps {
  label: string;
  value: string;
  change?: string;
}

export function StatCard({ label, value, change }: StatCardProps) {
  const isPositive = change?.startsWith('+');

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
