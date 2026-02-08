'use client';

import { useState, useEffect, useCallback } from 'react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalUsersChange: number;
  activeUsersChange: number;
  monthlyRevenueChange: number;
  activeSubscriptionsChange: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { getAdminStats } = await import('../lib/admin-actions');
      const data = await getAdminStats();
      setStats(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
