import { tossClient } from './client';
import type { CancelParams, TossPayment } from './types';

export async function refundPayment(paymentKey: string, params: CancelParams): Promise<TossPayment> {
  return tossClient.cancelPayment(paymentKey, params);
}
