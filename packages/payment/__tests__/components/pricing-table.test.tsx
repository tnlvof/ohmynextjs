import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricingTable } from '../../src/components/pricing-table';
import type { Plan } from '../../src/types';

const mockPlans: Plan[] = [
  {
    id: 'plan-free', name: '무료', slug: 'free', description: '기본 기능',
    price: 0, currency: 'KRW', interval: 'month', intervalCount: 1,
    features: ['기본 기능'], isActive: true, sortOrder: 0, metadata: null,
  },
  {
    id: 'plan-pro', name: '프로', slug: 'pro', description: '고급 기능',
    price: 9900, currency: 'KRW', interval: 'month', intervalCount: 1,
    features: ['고급 기능', '우선 지원'], isActive: true, sortOrder: 1, metadata: null,
  },
];

describe('PricingTable', () => {
  it('should render all plans', () => {
    render(<PricingTable plans={mockPlans} onSelect={() => {}} />);

    expect(screen.getByText('무료')).toBeInTheDocument();
    expect(screen.getByText('프로')).toBeInTheDocument();
  });

  it('should display plan prices', () => {
    render(<PricingTable plans={mockPlans} onSelect={() => {}} />);

    expect(screen.getByText('₩0')).toBeInTheDocument();
    expect(screen.getByText('₩9,900')).toBeInTheDocument();
  });

  it('should display features', () => {
    render(<PricingTable plans={mockPlans} onSelect={() => {}} />);

    expect(screen.getByText('✓ 기본 기능')).toBeInTheDocument();
    expect(screen.getByText('✓ 고급 기능')).toBeInTheDocument();
    expect(screen.getByText('✓ 우선 지원')).toBeInTheDocument();
  });

  it('should highlight current plan', () => {
    render(<PricingTable plans={mockPlans} currentPlanId="plan-pro" onSelect={() => {}} />);

    const buttons = screen.getAllByRole('button');
    const proButton = buttons.find(b => b.textContent === '현재 플랜');
    expect(proButton).toBeInTheDocument();
    expect(proButton).toBeDisabled();
  });

  it('should call onSelect when clicking a plan', () => {
    const onSelect = vi.fn();
    render(<PricingTable plans={mockPlans} onSelect={onSelect} />);

    const selectButtons = screen.getAllByText('선택하기');
    fireEvent.click(selectButtons[0]);

    expect(onSelect).toHaveBeenCalledWith('plan-free');
  });
});
