import type { PaymentConfig, PaymentResult } from './types';

export class TossPayments {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<PaymentResult> {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.config.secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await response.json();

    return {
      orderId: data.orderId,
      paymentKey: data.paymentKey,
      amount: data.totalAmount,
      status: response.ok ? 'success' : 'failed',
    };
  }
}
