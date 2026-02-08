import {
  type ConfirmPaymentParams,
  type CancelParams,
  type BillingKeyParams,
  type BillingPayParams,
  type TossPayment,
  type BillingKeyResponse,
  TossPaymentError,
} from './types';

const TOSS_API_URL = 'https://api.tosspayments.com/v1';

export class TossClient {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${TOSS_API_URL}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new TossPaymentError(error.code, error.message);
    }

    return response.json();
  }

  async confirmPayment(params: ConfirmPaymentParams): Promise<TossPayment> {
    return this.request<TossPayment>('POST', '/payments/confirm', params);
  }

  async cancelPayment(paymentKey: string, params: CancelParams): Promise<TossPayment> {
    return this.request<TossPayment>('POST', `/payments/${paymentKey}/cancel`, params);
  }

  async issueBillingKey(params: BillingKeyParams): Promise<BillingKeyResponse> {
    return this.request<BillingKeyResponse>('POST', '/billing/authorizations/issue', params);
  }

  async payWithBillingKey(billingKey: string, params: BillingPayParams): Promise<TossPayment> {
    return this.request<TossPayment>('POST', `/billing/${billingKey}`, params);
  }
}

export const tossClient = new TossClient(process.env.TOSS_SECRET_KEY || '');
