import { tossClient } from './client';
import type { BillingKeyParams, BillingPayParams, BillingKeyResponse, TossPayment } from './types';

export async function issueBillingKey(params: BillingKeyParams): Promise<BillingKeyResponse> {
  return tossClient.issueBillingKey(params);
}

export async function payWithBillingKey(billingKey: string, params: BillingPayParams): Promise<TossPayment> {
  return tossClient.payWithBillingKey(billingKey, params);
}
