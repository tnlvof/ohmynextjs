import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthGuard } from '../../src/components/auth-guard';
import type { User } from '../../src/types';

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test',
  avatar_url: null,
  provider: null,
  role: 'user',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  last_sign_in_at: null,
};

describe('AuthGuard', () => {
  it('should render children when authenticated', () => {
    render(
      <AuthGuard user={mockUser}>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show login required when not authenticated', () => {
    render(
      <AuthGuard user={null}>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('auth-guard-redirect')).toBeInTheDocument();
  });

  it('should show fallback when not authenticated and fallback provided', () => {
    render(
      <AuthGuard user={null} fallback={<div>Please login</div>}>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Please login')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <AuthGuard user={null} isLoading>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(screen.getByTestId('auth-guard-loading')).toBeInTheDocument();
  });

  it('should show forbidden when role does not match', () => {
    render(
      <AuthGuard user={mockUser} requiredRole="admin">
        <div>Admin Content</div>
      </AuthGuard>
    );
    expect(screen.getByTestId('auth-guard-forbidden')).toBeInTheDocument();
  });

  it('should render children when role matches', () => {
    render(
      <AuthGuard user={{ ...mockUser, role: 'admin' }} requiredRole="admin">
        <div>Admin Content</div>
      </AuthGuard>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
