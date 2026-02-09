'use client';

import { StatsCards, RevenueChart, UserGrowthChart, RecentActivity } from '@ohmynextjs/admin/src/components/dashboard';
import { useState, useEffect } from 'react';

const mockRevenueData = [
  { month: '2025-09', revenue: 3200000 },
  { month: '2025-10', revenue: 3800000 },
  { month: '2025-11', revenue: 4100000 },
  { month: '2025-12', revenue: 3900000 },
  { month: '2026-01', revenue: 4500000 },
  { month: '2026-02', revenue: 4800000 },
];

const mockGrowthData = [
  { date: '2026-01-01', count: 45 },
  { date: '2026-01-08', count: 62 },
  { date: '2026-01-15', count: 58 },
  { date: '2026-01-22', count: 71 },
  { date: '2026-01-29', count: 80 },
  { date: '2026-02-05', count: 89 },
];

const mockActivities = [
  { id: '1', userId: 'u1', userName: '김민수', action: '회원가입', createdAt: '2026-02-09 14:30' },
  { id: '2', userId: 'u2', userName: '이지영', action: 'Pro 플랜 구독', createdAt: '2026-02-09 13:15' },
  { id: '3', userId: 'u3', userName: '박준혁', action: '결제 완료 ₩29,000', createdAt: '2026-02-09 11:42' },
  { id: '4', userId: 'u4', userName: '최서연', action: '프로필 업데이트', createdAt: '2026-02-08 22:10' },
];

const mockStats = {
  totalUsers: 1234,
  activeUsers: 892,
  monthlyRevenue: 4560000,
  activeSubscriptions: 567,
  totalUsersChange: 12,
  activeUsersChange: 8,
  monthlyRevenueChange: 15,
  activeSubscriptionsChange: 5,
};

export default function AdminPage() {
  const [stats, setStats] = useState<typeof mockStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production: fetch from /api/admin/stats
    const timer = setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
        <p className="text-muted-foreground">서비스 전체 현황을 한눈에 확인하세요.</p>
      </div>

      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <RevenueChart data={mockRevenueData} />
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <UserGrowthChart data={mockGrowthData} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <RecentActivity activities={mockActivities} />
      </div>
    </div>
  );
}
