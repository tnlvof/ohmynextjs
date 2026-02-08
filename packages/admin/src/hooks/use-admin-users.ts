'use client';

import { useState, useCallback } from 'react';

interface Filters {
  search?: string;
  role?: 'all' | 'admin' | 'user';
  status?: 'all' | 'active' | 'banned';
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'banned' | 'deleted';
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In production: call getUsers server action
      setUsers([]);
      setTotal(0);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  return { users, total, page, setPage, filters, setFilters, isLoading, error, refetch: fetchUsers };
}
