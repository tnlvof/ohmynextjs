import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCards } from '../../src/components/dashboard/stats-cards';

describe('StatsCards', () => {
  const defaultStats = {
    totalUsers: 1234,
    activeUsers: 567,
    monthlyRevenue: 1234567,
    activeSubscriptions: 89,
    totalUsersChange: 5.2,
    activeUsersChange: -2.1,
    monthlyRevenueChange: 12.3,
    activeSubscriptionsChange: 3.4,
  };

  it('should render all stat cards', () => {
    render(<StatsCards stats={defaultStats} isLoading={false} />);
    expect(screen.getByText('전체 유저 수')).toBeInTheDocument();
    expect(screen.getByText('활성 유저')).toBeInTheDocument();
    expect(screen.getByText('이번 달 매출')).toBeInTheDocument();
    expect(screen.getByText('구독자 수')).toBeInTheDocument();
  });

  it('should format numbers correctly', () => {
    render(<StatsCards stats={defaultStats} isLoading={false} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('₩1,234,567')).toBeInTheDocument();
  });

  it('should show increase/decrease indicators', () => {
    render(<StatsCards stats={defaultStats} isLoading={false} />);
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('-2.1%')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<StatsCards stats={null} isLoading={true} />);
    const loadingElements = screen.getAllByTestId('stats-card-loading');
    expect(loadingElements.length).toBe(4);
  });
});
