import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserTable } from '../../src/components/users/user-table';

describe('UserTable', () => {
  const mockUsers = [
    { id: '1', email: 'user1@test.com', name: 'User 1', role: 'user' as const, status: 'active' as const, avatar_url: null, created_at: '2024-01-01', last_sign_in_at: '2024-01-10' },
    { id: '2', email: 'admin@test.com', name: 'Admin', role: 'admin' as const, status: 'active' as const, avatar_url: null, created_at: '2024-01-02', last_sign_in_at: '2024-01-11' },
  ];

  it('should render user list', () => {
    render(<UserTable users={mockUsers} total={2} page={1} onPageChange={() => {}} onAction={() => {}} />);
    expect(screen.getByText('user1@test.com')).toBeInTheDocument();
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(<UserTable users={[]} total={0} page={1} onPageChange={() => {}} onAction={() => {}} />);
    expect(screen.getByText('유저가 없습니다')).toBeInTheDocument();
  });
});
