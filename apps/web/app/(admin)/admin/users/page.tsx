'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserTable, UserFilters, UserDetailDialog } from '@ohmynextjs/admin/src/components/users';

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

const mockUsers: AdminUser[] = [
  { id: 'u1', email: 'minsu@example.com', name: '김민수', role: 'admin', status: 'active', avatar_url: null, created_at: '2025-06-15', last_sign_in_at: '2026-02-09' },
  { id: 'u2', email: 'jiyoung@example.com', name: '이지영', role: 'user', status: 'active', avatar_url: null, created_at: '2025-08-20', last_sign_in_at: '2026-02-08' },
  { id: 'u3', email: 'junhyuk@example.com', name: '박준혁', role: 'user', status: 'active', avatar_url: null, created_at: '2025-10-01', last_sign_in_at: '2026-02-07' },
  { id: 'u4', email: 'seoyeon@example.com', name: '최서연', role: 'user', status: 'banned', avatar_url: null, created_at: '2025-11-10', last_sign_in_at: '2026-01-15' },
  { id: 'u5', email: 'haneul@example.com', name: '정하늘', role: 'user', status: 'active', avatar_url: null, created_at: '2026-01-05', last_sign_in_at: '2026-02-09' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    // In production: fetch from /api/admin/users
    setTimeout(() => {
      let filtered = [...mockUsers];
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter(u => u.name?.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }
      if (filters.role && filters.role !== 'all') {
        filtered = filtered.filter(u => u.role === filters.role);
      }
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(u => u.status === filters.status);
      }
      setUsers(filtered);
      setTotal(filtered.length);
      setIsLoading(false);
    }, 300);
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, page]);

  const handleAction = (userId: string, action: string) => {
    if (action === 'detail') {
      const user = users.find((u) => u.id === userId);
      if (user) setSelectedUser(user);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
        <p className="text-muted-foreground">등록된 사용자를 조회하고 관리합니다.</p>
      </div>

      <UserFilters filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <UserTable
          users={users}
          total={total}
          page={page}
          onPageChange={setPage}
          onAction={handleAction}
        />
      )}

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
