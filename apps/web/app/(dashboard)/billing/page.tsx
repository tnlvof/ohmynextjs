'use client';

import { BillingPortal, useSubscription } from '@ohmynextjs/payment';
import type { Subscription, Plan, Payment } from '@ohmynextjs/payment';

// Mock data - in production, fetch from API/server actions
const mockPlan: Plan = {
  id: 'pro',
  name: 'Pro',
  slug: 'pro',
  description: '프로 사용자를 위한 모든 기능',
  price: 29000,
  currency: 'KRW',
  interval: '월',
  intervalCount: 1,
  features: ['무제한 프로젝트', '우선 지원', '고급 분석', 'API 접근'],
  isActive: true,
  sortOrder: 2,
  metadata: null,
};

const mockPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    slug: 'basic',
    description: '개인 사용자를 위한 기본 플랜',
    price: 9000,
    currency: 'KRW',
    interval: '월',
    intervalCount: 1,
    features: ['프로젝트 3개', '기본 지원'],
    isActive: true,
    sortOrder: 1,
    metadata: null,
  },
  mockPlan,
  {
    id: 'enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    description: '팀과 기업을 위한 엔터프라이즈',
    price: 99000,
    currency: 'KRW',
    interval: '월',
    intervalCount: 1,
    features: ['무제한 모든 기능', '전담 지원', 'SLA 보장', '커스텀 연동'],
    isActive: true,
    sortOrder: 3,
    metadata: null,
  },
];

const mockSubscription: Subscription = {
  id: 'sub_1',
  userId: 'user_1',
  planId: 'pro',
  billingKey: null,
  status: 'active',
  currentPeriodStart: new Date('2026-02-01'),
  currentPeriodEnd: new Date('2026-03-01'),
  cancelAtPeriodEnd: false,
  cancelledAt: null,
  trialStart: null,
  trialEnd: null,
  metadata: null,
  createdAt: new Date('2025-12-01'),
  updatedAt: new Date('2026-02-01'),
};

const mockPayments: Payment[] = [
  { id: 'pay_1', userId: 'user_1', planId: 'pro', orderId: 'OMN_20260201001', paymentKey: 'pk_1', amount: 29000, currency: 'KRW', status: 'paid', method: 'card', receiptUrl: null, failReason: null, cancelReason: null, cancelAmount: null, paidAt: new Date('2026-02-01'), cancelledAt: null, metadata: null, createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
  { id: 'pay_2', userId: 'user_1', planId: 'pro', orderId: 'OMN_20260101001', paymentKey: 'pk_2', amount: 29000, currency: 'KRW', status: 'paid', method: 'card', receiptUrl: null, failReason: null, cancelReason: null, cancelAmount: null, paidAt: new Date('2026-01-01'), cancelledAt: null, metadata: null, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { id: 'pay_3', userId: 'user_1', planId: 'pro', orderId: 'OMN_20251201001', paymentKey: 'pk_3', amount: 29000, currency: 'KRW', status: 'paid', method: 'card', receiptUrl: null, failReason: null, cancelReason: null, cancelAmount: null, paidAt: new Date('2025-12-01'), cancelledAt: null, metadata: null, createdAt: new Date('2025-12-01'), updatedAt: new Date('2025-12-01') },
];

export default function BillingPage() {
  const { cancel } = useSubscription(mockSubscription);

  const handlePlanSelect = (planId: string) => {
    // In production: redirect to payment flow
    console.log('Selected plan:', planId);
  };

  const handleCancel = async () => {
    // In production: call cancel subscription server action
    await cancel(async () => {
      console.log('Subscription cancelled');
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">빌링</h1>
        <p className="text-muted-foreground">구독 및 결제 내역을 관리하세요.</p>
      </div>

      <BillingPortal
        subscription={mockSubscription}
        plan={mockPlan}
        plans={mockPlans}
        payments={mockPayments}
        onPlanSelect={handlePlanSelect}
        onCancel={handleCancel}
      />
    </div>
  );
}
