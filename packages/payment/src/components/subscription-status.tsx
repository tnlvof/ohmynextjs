'use client';

import React from 'react';
import type { Subscription, Plan } from '../types';
import { formatPrice } from '../lib/price-format';

export interface SubscriptionStatusProps {
  subscription: Subscription | null;
  plan?: Plan | null;
  onCancel?: () => void;
}

const statusLabels: Record<string, { text: string; className: string }> = {
  active: { text: '활성', className: 'bg-green-100 text-green-800' },
  cancelled: { text: '취소됨', className: 'bg-gray-100 text-gray-800' },
  past_due: { text: '연체', className: 'bg-red-100 text-red-800' },
  expired: { text: '만료', className: 'bg-gray-100 text-gray-800' },
  trialing: { text: '체험중', className: 'bg-blue-100 text-blue-800' },
};

export function SubscriptionStatus({ subscription, plan, onCancel }: SubscriptionStatusProps) {
  if (!subscription) {
    return <p className="text-center text-gray-500 py-8">구독 중인 플랜이 없습니다</p>;
  }

  const status = statusLabels[subscription.status] ?? { text: subscription.status, className: 'bg-gray-100' };

  return (
    <div className="rounded-lg border p-6">
      {plan && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-2xl font-bold">{formatPrice(plan.price)}<span className="text-sm font-normal text-gray-500">/{plan.interval}</span></p>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <span>상태:</span>
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
          {status.text}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        다음 결제일: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
      </p>
      {subscription.cancelAtPeriodEnd && (
        <p className="text-sm text-orange-600 mb-4">기간 종료 시 구독이 취소됩니다</p>
      )}
      {onCancel && subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
        <button
          onClick={onCancel}
          className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          구독 취소
        </button>
      )}
    </div>
  );
}
