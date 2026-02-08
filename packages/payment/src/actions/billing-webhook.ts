'use server';

import type { Subscription } from '../types';
import type { BillingPayParams, TossPayment } from '../toss/types';
import { generateOrderId } from '../lib/order-id';

interface Dependencies {
  findDueSubscriptions: () => Promise<(Subscription & { plan: { name: string; price: number } })[]>;
  payWithBillingKey: (billingKey: string, params: BillingPayParams) => Promise<TossPayment>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
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

export function setBillingWebhookDeps(deps: Dependencies) {
  _deps = deps;
}

export async function processBillingWebhook(): Promise<{ processed: number; failed: number }> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const subscriptions = await _deps.findDueSubscriptions();
  let processed = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    if (!sub.billingKey) {
      failed++;
      continue;
    }

    try {
      const orderId = generateOrderId();
      const payment = await _deps.payWithBillingKey(sub.billingKey, {
        customerKey: sub.userId,
        amount: sub.plan.price,
        orderId,
        orderName: `${sub.plan.name} 구독 갱신`,
      });

      const newPeriodStart = new Date(sub.currentPeriodEnd);
      const newPeriodEnd = new Date(newPeriodStart);
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

      await _deps.updateSubscription(sub.id, {
        currentPeriodStart: newPeriodStart,
        currentPeriodEnd: newPeriodEnd,
      });

      await _deps.insertPayment({
        userId: sub.userId,
        planId: sub.planId,
        orderId,
        amount: sub.plan.price,
        orderName: `${sub.plan.name} 구독 갱신`,
        paymentKey: payment.paymentKey,
        status: 'paid',
        paidAt: new Date(payment.approvedAt),
      });

      processed++;
    } catch {
      failed++;
      await _deps.updateSubscription(sub.id, {
        status: 'past_due',
      });
    }
  }

  return { processed, failed };
}
