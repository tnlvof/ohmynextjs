import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionStatus } from '../../src/components/subscription-status';
import type { Subscription, Plan } from '../../src/types';

const mockPlan: Plan = {
  id: 'plan-pro', name: '프로', slug: 'pro', description: '고급 기능',
  price: 9900, currency: 'KRW', interval: 'month', intervalCount: 1,
  features: null, isActive: true, sortOrder: 1, metadata: null,
};

const mockSubscription: Subscription = {
  id: 'sub-1', userId: 'u1', planId: 'plan-pro',
  billingKey: 'bk_123', status: 'active',
  currentPeriodStart: new Date('2026-01-01'),
  currentPeriodEnd: new Date('2026-02-01'),
  cancelAtPeriodEnd: false, cancelledAt: null,
  trialStart: null, trialEnd: null, metadata: null,
  createdAt: new Date(), updatedAt: new Date(),
};

describe('SubscriptionStatus', () => {
  it('should display active status', () => {
    render(<SubscriptionStatus subscription={mockSubscription} plan={mockPlan} />);

    expect(screen.getByText('활성')).toBeInTheDocument();
  });

  it('should display plan name and price', () => {
    render(<SubscriptionStatus subscription={mockSubscription} plan={mockPlan} />);

    expect(screen.getByText('프로')).toBeInTheDocument();
    expect(screen.getByText(/₩9,900/)).toBeInTheDocument();
  });

  it('should display next billing date', () => {
    render(<SubscriptionStatus subscription={mockSubscription} plan={mockPlan} />);

    expect(screen.getByText(/다음 결제일/)).toBeInTheDocument();
  });

  it('should show cancel button for active subscription', () => {
    const onCancel = vi.fn();
    render(<SubscriptionStatus subscription={mockSubscription} plan={mockPlan} onCancel={onCancel} />);

    const cancelButton = screen.getByText('구독 취소');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  it('should show cancelled status', () => {
    const cancelled = { ...mockSubscription, status: 'cancelled' as const };
    render(<SubscriptionStatus subscription={cancelled} plan={mockPlan} />);

    expect(screen.getByText('취소됨')).toBeInTheDocument();
  });

  it('should show past_due status', () => {
    const pastDue = { ...mockSubscription, status: 'past_due' as const };
    render(<SubscriptionStatus subscription={pastDue} plan={mockPlan} />);

    expect(screen.getByText('연체')).toBeInTheDocument();
  });

  it('should show empty state when no subscription', () => {
    render(<SubscriptionStatus subscription={null} />);

    expect(screen.getByText('구독 중인 플랜이 없습니다')).toBeInTheDocument();
  });

  it('should not show cancel button for cancelled subscription', () => {
    const onCancel = vi.fn();
    const cancelled = { ...mockSubscription, status: 'cancelled' as const };
    render(<SubscriptionStatus subscription={cancelled} plan={mockPlan} onCancel={onCancel} />);

    expect(screen.queryByText('구독 취소')).not.toBeInTheDocument();
  });
});
