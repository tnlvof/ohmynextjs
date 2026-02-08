import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BillingPortal } from '../../src/components/billing-portal';
import type { Subscription, Plan, Payment } from '../../src/types';

const mockPlan: Plan = {
  id: 'plan-pro', name: '프로', slug: 'pro', description: '고급 기능',
  price: 9900, currency: 'KRW', interval: 'month', intervalCount: 1,
  features: ['고급 기능'], isActive: true, sortOrder: 1, metadata: null,
};

const mockPlans: Plan[] = [
  {
    id: 'plan-free', name: '무료', slug: 'free', description: null,
    price: 0, currency: 'KRW', interval: 'month', intervalCount: 1,
    features: null, isActive: true, sortOrder: 0, metadata: null,
  },
  mockPlan,
];

const mockSubscription: Subscription = {
  id: 'sub-1', userId: 'u1', planId: 'plan-pro',
  billingKey: 'bk_123', status: 'active',
  currentPeriodStart: new Date('2026-01-01'),
  currentPeriodEnd: new Date('2026-02-01'),
  cancelAtPeriodEnd: false, cancelledAt: null,
  trialStart: null, trialEnd: null, metadata: null,
  createdAt: new Date(), updatedAt: new Date(),
};

const mockPayments: Payment[] = [
  {
    id: '1', userId: 'u1', planId: 'plan-pro', orderId: 'OMN_001', paymentKey: 'pk_1',
    amount: 9900, currency: 'KRW', status: 'paid', method: 'card',
    receiptUrl: null, failReason: null, cancelReason: null, cancelAmount: null,
    paidAt: new Date('2026-01-01'), cancelledAt: null, metadata: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

describe('BillingPortal', () => {
  it('should render subscription info section', () => {
    render(
      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
      />,
    );

    expect(screen.getByText('구독 정보')).toBeInTheDocument();
  });

  it('should render pricing table section', () => {
    render(
      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
      />,
    );

    expect(screen.getByText('요금제 변경')).toBeInTheDocument();
    expect(screen.getByText('무료')).toBeInTheDocument();
  });

  it('should render payment history section', () => {
    render(
      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
      />,
    );

    expect(screen.getByText('결제 내역')).toBeInTheDocument();
    expect(screen.getByText('OMN_001')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(
      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByText('구독 취소'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onPlanSelect when a plan is selected', () => {
    const onPlanSelect = vi.fn();
    render(
      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
        onPlanSelect={onPlanSelect}
      />,
    );

    fireEvent.click(screen.getByText('선택하기'));
    expect(onPlanSelect).toHaveBeenCalledWith('plan-free');
  });
});
