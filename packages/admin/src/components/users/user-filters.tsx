import React from 'react';

interface Filters {
  search?: string;
  role?: 'all' | 'admin' | 'user';
  status?: 'all' | 'active' | 'banned';
}

interface UserFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="이름 또는 이메일 검색"
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />
      <label>
        역할
        <select
          aria-label="역할"
          value={filters.role || 'all'}
          onChange={(e) => onFilterChange({ ...filters, role: e.target.value as Filters['role'] })}
        >
          <option value="all">전체</option>
          <option value="admin">관리자</option>
          <option value="user">일반</option>
        </select>
      </label>
      <label>
        상태
        <select
          aria-label="상태"
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as Filters['status'] })}
        >
          <option value="all">전체</option>
          <option value="active">활성</option>
          <option value="banned">차단</option>
        </select>
      </label>
    </div>
  );
}
