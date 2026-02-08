import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { UserButton } from '../../src/components/user-button';
import type { User } from '../../src/types';

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  provider: 'google',
  role: 'user',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  last_sign_in_at: '2024-01-01',
};

describe('UserButton', () => {
  it('should render nothing when no user', () => {
    const { container } = render(<UserButton user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should show avatar image when avatar_url exists', () => {
    render(<UserButton user={mockUser} />);
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should show initials when no avatar_url', () => {
    render(<UserButton user={{ ...mockUser, avatar_url: null }} />);
    expect(screen.getByTestId('avatar-initials')).toHaveTextContent('T');
  });

  it('should show dropdown on click', () => {
    render(<UserButton user={mockUser} />);
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('avatar-button'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('should show user name when showName is true', () => {
    render(<UserButton user={mockUser} showName />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });

  it('should show admin link for admin users', () => {
    render(<UserButton user={{ ...mockUser, role: 'admin' }} />);
    fireEvent.click(screen.getByTestId('avatar-button'));
    expect(screen.getByTestId('admin-link')).toBeInTheDocument();
  });

  it('should not show admin link for regular users', () => {
    render(<UserButton user={mockUser} />);
    fireEvent.click(screen.getByTestId('avatar-button'));
    expect(screen.queryByTestId('admin-link')).not.toBeInTheDocument();
  });

  it('should call onSignOut when logout clicked', () => {
    const onSignOut = vi.fn();
    render(<UserButton user={mockUser} onSignOut={onSignOut} />);
    fireEvent.click(screen.getByTestId('avatar-button'));
    fireEvent.click(screen.getByTestId('signout-button'));
    expect(onSignOut).toHaveBeenCalled();
  });
});
