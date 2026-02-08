'use client';

import React from 'react';
import type { Subscription, Plan, Payment } from '../types';
import { SubscriptionStatus } from './subscription-status';
import { PaymentHistory } from './payment-history';
import { PricingTable } from './pricing-table';

export interface BillingPortalProps {
  subscription: Subscription | null;
  plan: Plan | null;
  plans: Plan[];
  payments: Payment[];
  onPlanSelect?: (planId: string) => void;
  onCancel?: () => void;
}

export function BillingPortal({ subscription, plan, plans, payments, onPlanSelect, onCancel }: BillingPortalProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">구독 정보</h2>
        <SubscriptionStatus subscription={subscription} plan={plan} onCancel={onCancel} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">요금제 변경</h2>
        <PricingTable
          plans={plans}
          currentPlanId={subscription?.planId}
          onSelect={onPlanSelect ?? (() => {})}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">결제 내역</h2>
        <PaymentHistory payments={payments} />
      </section>
    </div>
  );
}
