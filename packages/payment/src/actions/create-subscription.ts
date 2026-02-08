'use server';

import type { CreateSubscriptionInput, Plan, Subscription } from '../types';
import { PaymentError } from '../types';
import type { BillingKeyResponse, TossPayment, BillingKeyParams, BillingPayParams } from '../toss/types';
import { generateOrderId } from '../lib/order-id';

interface Dependencies {
  getCurrentUserId: () => Promise<string>;
  findPlanById: (planId: string) => Promise<Plan | null>;
  issueBillingKey: (params: BillingKeyParams) => Promise<BillingKeyResponse>;
  payWithBillingKey: (billingKey: string, params: BillingPayParams) => Promise<TossPayment>;
  insertSubscription: (data: {
    userId: string;
    planId: string;
    billingKey: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }) => Promise<Subscription>;
  insertPayment: (data: {
    userId: string;
    planId: string;
    orderId: string;
    amount: number;
    orderName: string;
    paymentKey: string;
    status: string;
    paidAt: Date;
  }) => Promise<void>;
}

let _deps: Dependencies | null = null;

export function setCreateSubscriptionDeps(deps: Dependencies) {
  _deps = deps;
}

export async function createSubscription(input: CreateSubscriptionInput): Promise<{ subscription: Subscription }> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const userId = await _deps.getCurrentUserId();
  if (!userId) {
    throw new PaymentError('UNAUTHORIZED', '인증이 필요합니다');
  }

  const plan = await _deps.findPlanById(input.planId);
  if (!plan) {
    throw new PaymentError('PLAN_NOT_FOUND', '요금제를 찾을 수 없습니다');
  }

  // Issue billing key
  let billingKeyResponse: BillingKeyResponse;
  try {
    billingKeyResponse = await _deps.issueBillingKey({
      customerKey: input.customerKey,
      authKey: input.authKey,
    });
  } catch {
    throw new PaymentError('BILLING_KEY_FAILED', '카드 등록에 실패했습니다');
  }

  // First payment
  const orderId = generateOrderId();
  const tossPayment = await _deps.payWithBillingKey(billingKeyResponse.billingKey, {
    customerKey: input.customerKey,
    amount: plan.price,
    orderId,
    orderName: `${plan.name} 구독`,
  });

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + (plan.intervalCount || 1));

  // Create subscription
  const subscription = await _deps.insertSubscription({
    userId,
    planId: plan.id,
    billingKey: billingKeyResponse.billingKey,
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
  });

  // Create payment record
  await _deps.insertPayment({
    userId,
    planId: plan.id,
    orderId,
    amount: plan.price,
    orderName: `${plan.name} 구독`,
    paymentKey: tossPayment.paymentKey,
    status: 'paid',
    paidAt: new Date(tossPayment.approvedAt),
  });

  return { subscription };
}
