import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from '../../src/components/layout/admin-sidebar';

describe('AdminSidebar', () => {
  it('should render menu items', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('유저 관리')).toBeInTheDocument();
    expect(screen.getByText('결제 관리')).toBeInTheDocument();
    expect(screen.getByText('설정')).toBeInTheDocument();
  });

  it('should render links with correct hrefs', () => {
    render(<AdminSidebar />);
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: '유저 관리' })).toHaveAttribute('href', '/admin/users');
    expect(screen.getByRole('link', { name: '결제 관리' })).toHaveAttribute('href', '/admin/payments');
    expect(screen.getByRole('link', { name: '설정' })).toHaveAttribute('href', '/admin/settings');
  });
});
