export interface PaymentConfig {
  provider: 'toss' | 'portone';
  clientKey: string;
  secretKey: string;
}

export interface PaymentResult {
  orderId: string;
  paymentKey: string;
  amount: number;
  status: 'success' | 'failed' | 'cancelled';
}
