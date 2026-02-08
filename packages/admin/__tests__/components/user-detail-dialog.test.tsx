import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserDetailDialog } from '../../src/components/users/user-detail-dialog';

describe('UserDetailDialog', () => {
  const mockUser = {
    id: '1',
    email: 'user@test.com',
    name: 'Test User',
    role: 'user' as const,
    status: 'active' as const,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    last_sign_in_at: '2024-01-10T00:00:00Z',
  };

  it('should display user details when open', () => {
    render(<UserDetailDialog user={mockUser} open={true} onClose={() => {}} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<UserDetailDialog user={mockUser} open={false} onClose={() => {}} />);
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });
});
