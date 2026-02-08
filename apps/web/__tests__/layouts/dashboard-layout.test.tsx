import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardLayout from '@/app/(dashboard)/layout';

describe('DashboardLayout', () => {
  it('renders Header and Sidebar', () => {
    render(<DashboardLayout><div>dashboard content</div></DashboardLayout>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('dashboard content')).toBeInTheDocument();
  });
});
