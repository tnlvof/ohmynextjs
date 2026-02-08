'use server';

import { generateOrderId } from '../lib/order-id';
import type { CreateOrderInput, CreateOrderResult } from '../types';
import { PaymentError } from '../types';

interface Dependencies {
  getCurrentUserId: () => Promise<string>;
  insertPayment: (data: {
    userId: string;
    planId?: string;
    orderId: string;
    amount: number;
    orderName: string;
    metadata?: Record<string, unknown>;
  }) => Promise<void>;
}

let _deps: Dependencies | null = null;

export function setCreateOrderDeps(deps: Dependencies) {
  _deps = deps;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!_deps) throw new Error('Dependencies not initialized');

  const userId = await _deps.getCurrentUserId();
  if (!userId) {
    throw new PaymentError('UNAUTHORIZED', '인증이 필요합니다');
  }

  if (input.amount <= 0) {
    throw new PaymentError('INVALID_AMOUNT', '결제 금액이 올바르지 않습니다');
  }

  const orderId = generateOrderId();

  await _deps.insertPayment({
    userId,
    planId: input.planId,
    orderId,
    amount: input.amount,
    orderName: input.orderName,
    metadata: input.metadata,
  });

  return {
    orderId,
    amount: input.amount,
    orderName: input.orderName,
  };
}
