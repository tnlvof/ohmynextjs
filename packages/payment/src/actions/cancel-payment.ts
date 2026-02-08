'use server';

import type { CancelPaymentInput, Payment } from '../types';
import { PaymentError } from '../types';
import type { TossPayment, CancelParams } from '../toss/types';

interface Dependencies {
  getCurrentUserId: () => Promise<string>;
  findPaymentByPaymentKey: (paymentKey: string) => Promise<Payment | null>;
  updatePayment: (orderId: string, data: Partial<Payment>) => Promise<void>;
  cancelPayment: (paymentKey: string, params: CancelParams) => Promise<TossPayment>;
}

let _deps: Dependencies | null = null;

export function setCancelPaymentDeps(deps: Dependencies) {
  _deps = deps;
}

export async function cancelPayment(input: CancelPaymentInput): Promise<{ success: true; payment: TossPayment }> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const userId = await _deps.getCurrentUserId();
  if (!userId) {
    throw new PaymentError('UNAUTHORIZED', '인증이 필요합니다');
  }

  const payment = await _deps.findPaymentByPaymentKey(input.paymentKey);
  if (!payment) {
    throw new PaymentError('PAYMENT_NOT_FOUND', '결제 정보를 찾을 수 없습니다');
  }

  if (payment.status === 'refunded') {
    throw new PaymentError('PAYMENT_ALREADY_REFUNDED', '이미 환불된 결제입니다');
  }

  const tossPayment = await _deps.cancelPayment(input.paymentKey, {
    cancelReason: input.cancelReason,
    cancelAmount: input.cancelAmount,
  });

  const isPartial = input.cancelAmount !== undefined && input.cancelAmount < payment.amount;

  await _deps.updatePayment(payment.orderId, {
    status: isPartial ? 'partial_refunded' : 'refunded',
    cancelReason: input.cancelReason,
    cancelAmount: input.cancelAmount ?? payment.amount,
    cancelledAt: new Date(),
  });

  return { success: true, payment: tossPayment };
}
