'use server';

import type { CancelSubscriptionInput, Subscription } from '../types';
import { PaymentError } from '../types';

interface Dependencies {
  getCurrentUserId: () => Promise<string>;
  findSubscriptionById: (id: string) => Promise<Subscription | null>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
}

let _deps: Dependencies | null = null;

export function setCancelSubscriptionDeps(deps: Dependencies) {
  _deps = deps;
}

export async function cancelSubscription(input: CancelSubscriptionInput): Promise<{ success: true }> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const userId = await _deps.getCurrentUserId();
  if (!userId) {
    throw new PaymentError('UNAUTHORIZED', '인증이 필요합니다');
  }

  const subscription = await _deps.findSubscriptionById(input.subscriptionId);
  if (!subscription) {
    throw new PaymentError('SUBSCRIPTION_NOT_FOUND', '구독 정보를 찾을 수 없습니다');
  }

  if (subscription.status === 'cancelled') {
    throw new PaymentError('SUBSCRIPTION_ALREADY_CANCELLED', '이미 취소된 구독입니다');
  }

  if (input.immediate) {
    await _deps.updateSubscription(input.subscriptionId, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelAtPeriodEnd: false,
    });
  } else {
    await _deps.updateSubscription(input.subscriptionId, {
      cancelAtPeriodEnd: true,
    });
  }

  return { success: true };
}
