'use server';

import type { ConfirmPaymentInput, Payment } from '../types';
import { PaymentError } from '../types';
import type { TossPayment } from '../toss/types';

interface Dependencies {
  getCurrentUserId: () => Promise<string>;
  findPaymentByOrderId: (orderId: string) => Promise<Payment | null>;
  updatePayment: (orderId: string, data: Partial<Payment>) => Promise<void>;
  confirmPayment: (params: ConfirmPaymentInput) => Promise<TossPayment>;
}

let _deps: Dependencies | null = null;

export function setConfirmPaymentDeps(deps: Dependencies) {
  _deps = deps;
}

export async function confirmPayment(input: ConfirmPaymentInput): Promise<{ success: true; payment: TossPayment }> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const userId = await _deps.getCurrentUserId();
  if (!userId) {
    throw new PaymentError('UNAUTHORIZED', '인증이 필요합니다');
  }

  const payment = await _deps.findPaymentByOrderId(input.orderId);
  if (!payment) {
    throw new PaymentError('PAYMENT_NOT_FOUND', '결제 정보를 찾을 수 없습니다');
  }

  if (payment.status === 'paid') {
    throw new PaymentError('PAYMENT_ALREADY_APPROVED', '이미 처리된 결제입니다');
  }

  if (payment.amount !== input.amount) {
    throw new PaymentError('PAYMENT_AMOUNT_MISMATCH', '결제 금액이 일치하지 않습니다');
  }

  const tossPayment = await _deps.confirmPayment(input);

  await _deps.updatePayment(input.orderId, {
    status: 'paid',
    paymentKey: input.paymentKey,
    method: tossPayment.method as Payment['method'],
    receiptUrl: tossPayment.receipt?.url ?? null,
    paidAt: new Date(tossPayment.approvedAt),
  });

  return { success: true, payment: tossPayment };
}
