import { tossClient } from './client';
import type { ConfirmPaymentParams, TossPayment } from './types';

export async function confirmOneTimePayment(params: ConfirmPaymentParams): Promise<TossPayment> {
  return tossClient.confirmPayment(params);
}
